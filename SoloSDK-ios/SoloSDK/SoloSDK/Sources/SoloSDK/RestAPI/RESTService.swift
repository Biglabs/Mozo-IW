//
//  RESTService.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/22/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import Alamofire

public class RESTService {
    
    public private (set) var client:  SessionManager
    
    public init() {
        // Create a shared URL cache
        let memoryCapacity = 4 * 1024 * 1024; // 4 MB
        let diskCapacity = 20 * 1024 * 1024; // 20 MB
        let cache = URLCache(memoryCapacity: memoryCapacity, diskCapacity: diskCapacity, diskPath: "solo_wallet_cache")
        
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
    
    func execute(_ method: Alamofire.HTTPMethod, url: String, body: Any, completionHandler: completion = nil) {
        
        let headers = self.buildHTTPHeaders()
        guard let URL = URL(string: url) else {return}
        var request = URLRequest(url: URL)
        request.httpMethod = method.rawValue
        request.allHTTPHeaderFields = headers
        request.httpBody = try! JSONSerialization.data(withJSONObject: body, options: [])
        
        self.client.request(request).responseJSON { response in
            guard let completionHandler = completionHandler else {return}
            self.checkResponse(url: url, method: method, response: response, completion: completionHandler)
        }
    }
    
    func execute(_ method: Alamofire.HTTPMethod, url: String, param: String, completionHandler: completion = nil){
        let headers = self.buildHTTPHeaders()
        guard let URL = URL(string: url) else {return}
        var request = URLRequest(url: URL)
        request.httpMethod = method.rawValue
        request.allHTTPHeaderFields = headers
        request.httpBody = param.data(using: String.Encoding.utf8)
        
        self.client.request(request).responseJSON { response in
            guard let completionHandler = completionHandler else {return}
            self.checkResponse(url: url, method: method, response: response, completion: completionHandler)
        }
    }
    
    func execute(_ method: Alamofire.HTTPMethod, url: String, params: [String: Any]?, completionHandler: completion = nil) {
        let headers = self.buildHTTPHeaders()
        self.client.request(url, method: method, parameters: params, encoding: JSONEncoding.default, headers: headers)
            .responseJSON { response in
                guard let completionHandler = completionHandler else {return}
                self.checkResponse(url: url, method: method, response: response, completion: completionHandler)
        }
    }
    
    private func checkResponse(url: String, method: Alamofire.HTTPMethod, response: DataResponse<Any>,completion: completion = nil, completionProgress: completionProgress = nil){
        var connectionError: ConnectionError?
        let error = response.result.error
        if error != nil || response.response?.statusCode != 200 {
            connectionError = self.mappingConnectionError(response.response, error: error)
            if let completionHandler = completion {
                completionHandler(nil, connectionError)
            }
            if let completionProgressHandler = completionProgress {
                completionProgressHandler(nil, nil, connectionError)
            }
        }
    }
    
    private func mappingConnectionError(_ response: HTTPURLResponse?, error: Error?) -> ConnectionError?{
        var connectionError: ConnectionError?

        if let error = error, (error as NSError).domain == NSURLErrorDomain
            && ((error as NSError).code == NSURLErrorNotConnectedToInternet) {
            connectionError = ConnectionError.noInternetConnection
        } else if let error = error, (error as NSError).domain == NSURLErrorDomain
            && (error as NSError).code == NSURLErrorTimedOut {
            connectionError = ConnectionError.requestTimedOut
        } else if response?.statusCode == 404 {
            connectionError = ConnectionError.requestNotFound
        } else if response?.statusCode == 401 {
            connectionError = ConnectionError.authenticationRequired
        } else if let error = error {
            connectionError = ConnectionError.network(error: error)
        }
        return connectionError
    }
}
