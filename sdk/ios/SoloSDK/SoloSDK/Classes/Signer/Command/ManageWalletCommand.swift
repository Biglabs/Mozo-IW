//
//  SignWalletCommand.swift
//  Alamofire
//
//  Created by Tam Nguyen on 7/2/18.
//

import Foundation
import Result
import SwiftyJSON

public class ManageWalletCommand: Command {
    
    public var name = "MANAGE_WALLET"
    
    public var bundleId: String
    
    public func requestURL() -> URL {
        var urlStr = Configuration.SIGNER_URL_SCHEME + "://"
        let model = CommunicationDTO(action: self.name, receiver: "\(self.bundleId).\(Configuration.WALLET_URL_SCHEME)", params: nil, coinType: nil, network: nil)!
        urlStr += model.rawString()
        return URL(string : urlStr.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)!)!
    }
    
    /// Completion closure
    public var completion: (Result<String, ErrorDTO>) -> Void
    
    public init(bundleId: String, completion: @escaping (Result<String, ErrorDTO>) -> Void) {
        self.bundleId = bundleId
        self.completion = completion
    }
    
    public func handleCallback(url: URL) -> Bool {
        
        let urls: [String] = url.absoluteString.components(separatedBy: "://")
        if urls.count == 0 {
            return false
        }
        let jsonData = urls[1]
        
        guard let jsonStr = jsonData.removingPercentEncoding else {
            print("handleReceivedUrlFromWalletApp: data is nil")
            return false
        }
        let data = SwiftyJSON.JSON.init(parseJSON: jsonStr)
        let com = CommunicationDTO(json: data)
        
        guard let action = com?.action, action == self.name else {
            return false
        }
        
        guard let result = com?.result else {
            return false
        }
        
        if let error = result.error, error.code != nil {
            completion(.failure(error))
            return false
        }
        
        guard result.success == true else {
            return false
        }
        
        completion(.success(""))
        return true
    }
}

public extension SignerManager {
    public func manageWallet(_ completion: @escaping (Result<String, ErrorDTO>) -> Void) {
        let command = ManageWalletCommand(bundleId: self.bundleId, completion: completion)
        execute(command: command)
    }
}
