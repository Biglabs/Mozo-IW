//
//  ApiManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/5/18.
//

import Foundation
import Alamofire
import PromiseKit

public final class ApiManager {
    public private (set) var client: SessionManager
    
    public init() {
        // Create a shared URL cache
        let memoryCapacity = 4 * 1024 * 1024; // 4 MB
        let diskCapacity = 20 * 1024 * 1024; // 20 MB
        let cache = URLCache(memoryCapacity: memoryCapacity, diskCapacity: diskCapacity, diskPath: "mozo_sdk_cache")
        
        // Check network to update cachePolicy
        //let hasInternetConnection = try! Reachability.reachabilityForInternetConnection().isReachable()
        let cachePolicy: NSURLRequest.CachePolicy = .useProtocolCachePolicy//hasInternetConnection ? .UseProtocolCachePolicy : .ReturnCacheDataElseLoad
        
        // Create a custom configuration
        let configuration = URLSessionConfiguration.default
        configuration.httpAdditionalHeaders = SessionManager.defaultHTTPHeaders
        configuration.requestCachePolicy = cachePolicy
        configuration.urlCache = cache
        // Create your own manager instance that uses your custom configuration
        client = Alamofire.SessionManager(configuration: configuration)
    }
    
    private func buildHTTPHeaders() ->HTTPHeaders {
        let headers: HTTPHeaders = [
            "Authorization": "no_token",
            "Content-Type": MediaType.APPLICATION_JSON.rawValue,
            "Accept": MediaType.APPLICATION_JSON.rawValue,
            "Cache-Control": "private",
            "user-agent": "IOS"
        ]
        
        return headers
    }
    
    private func buildHeaderOauth() -> HTTPHeaders {
        let credentialData = "{OAUTH_CLIENT_ID}:{OAUTH_SECRET}".data(using:String.Encoding.utf8)
        let base64Credentials = credentialData?.base64EncodedString(options: []) ?? ""
        let authorization = "Basic \(base64Credentials)"
        let headers: HTTPHeaders = [
            "Authorization": authorization,
            "Content-Type": MediaType.APPLICATION_FORM_URLENCODED.rawValue,
            "Accept": MediaType.APPLICATION_JSON.rawValue,
            "user-agent": "IOS"
        ]
        return headers
    }
    
    public func convertNetworkToPath(network: String) -> String{
        var path = network.lowercased()
        path = path.replacingOccurrences(of: "_", with: "/")
        return path
    }
    
    public func extractNetworkPathFromText(network: String) -> String{
        let path = network.lowercased()
        let paths = path.components(separatedBy: "_")
        return paths.last!
    }
    
    private func mappingConnectionError(_ response: HTTPURLResponse?, error: Error?) -> ConnectionError?{
        var connectionError: ConnectionError?
        
        if let error = error, (error as NSError).domain == NSURLErrorDomain
            && ((error as NSError).code == NSURLErrorNotConnectedToInternet) {
            connectionError = ConnectionError.noInternetConnection
        } else if let error = error, (error as NSError).domain == NSURLErrorDomain
            && (error as NSError).code == NSURLErrorTimedOut {
            connectionError = ConnectionError.requestTimedOut
        } else if response?.statusCode == 500 {
            connectionError = ConnectionError.internalServerError
        } else if response?.statusCode == 404 {
            connectionError = ConnectionError.requestNotFound
        } else if response?.statusCode == 401 {
            connectionError = ConnectionError.authenticationRequired
        } else if response?.statusCode == 400 {
            connectionError = ConnectionError.badRequest
        } else if let error = error {
            connectionError = ConnectionError.network(error: error)
        }
        return connectionError
    }
    
    func execute(_ method: Alamofire.HTTPMethod, url: String, parameters: Any? = nil) -> Promise<[String: Any]> {
        print("Execute url: " + url)
        if parameters == nil {
            return self.execute(method, url: url, params: nil)
        } else if let params = parameters as? [String: Any] {
            return self.execute(method, url: url, params: params)
        } else if let param = parameters as? String {
            return self.execute(method, url: url, param: param)
        } else {
            return self.execute(method, url: url, body: parameters!)
        }
    }

    private func execute(_ method: Alamofire.HTTPMethod, url: String, body: Any) -> Promise<[String: Any]> {
        return Promise { seal in
            let headers = self.buildHTTPHeaders()
            guard let URL = URL(string: url) else {return}
            var request = URLRequest(url: URL)
            request.httpMethod = method.rawValue
            request.allHTTPHeaderFields = headers
            request.httpBody = try! JSONSerialization.data(withJSONObject: body, options: [])

            self.client.request(request)
                .validate()
                .responseJSON { response in
                    switch response.result {
                    case .success(let json):
                        guard let json = json  as? [String: Any] else {
                            return seal.reject(AFError.responseValidationFailed(reason: .dataFileNil))
                        }
                        seal.fulfill(json)
                    case .failure(let error):
                        let connectionError = self.checkResponse(response: response, error: error)
                        seal.reject(connectionError)
                    }
            }
        }
    }

    private func execute(_ method: Alamofire.HTTPMethod, url: String, param: String) -> Promise<[String: Any]> {
        return Promise { seal in
            let headers = self.buildHTTPHeaders()
            guard let URL = URL(string: url) else {return}
            var request = URLRequest(url: URL)
            request.httpMethod = method.rawValue
            request.allHTTPHeaderFields = headers
            request.httpBody = param.data(using: String.Encoding.utf8)

            self.client.request(request as URLRequestConvertible)
                .validate()
                .responseJSON { response in
                    switch response.result {
                    case .success(let json):
                        guard let json = json  as? [String: Any] else {
                            return seal.reject(AFError.responseValidationFailed(reason: .dataFileNil))
                        }
                        seal.fulfill(json)
                    case .failure(let error):
                        let connectionError = self.checkResponse(response: response, error: error)
                        seal.reject(connectionError)
                    }
            }
        }
    }

    private func execute(_ method: Alamofire.HTTPMethod, url: String, params: [String: Any]?) -> Promise<[String: Any]>{
        return Promise { seal in
            let headers = self.buildHTTPHeaders()
            self.client.request(url, method: method, parameters: params, encoding: JSONEncoding.default, headers: headers)
                .validate()
                .responseJSON { response in
                    switch response.result {
                    case .success(let json):
                        guard let json = json  as? [String: Any] else {
                            return seal.reject(AFError.responseValidationFailed(reason: .dataFileNil))
                        }
                        seal.fulfill(json)
                    case .failure(let error):
                        let connectionError = self.checkResponse(response: response, error: error)
                        seal.reject(connectionError)
                }
            }
        }
    }
    
    private func checkResponse(response: DataResponse<Any>, error: Error) -> ConnectionError {
        var connectionError = ConnectionError.unknowError
        if (response.response?.statusCode)! < 200 || (response.response?.statusCode)! > 299  {
            connectionError = self.mappingConnectionError(response.response, error: error)!
        }
        return connectionError
    }
}