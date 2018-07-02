//
//  SignWalletCommand.swift
//  Alamofire
//
//  Created by Tam Nguyen on 7/2/18.
//

import Foundation
import Result
import SwiftyJSON

public class SignWalletCommand: Command {
    
    public var name = "GET_WALLET"
    
    public var bundleId: String
    
    public func requestURL() -> URL? {
        var urlStr = Configuration.SIGNER_URL_SCHEME + "://"
        let model = CommunicationDTO(action: self.name, receiver: "\(self.bundleId).\(Configuration.WALLET_URL_SCHEME)", params: nil, coinType: nil)!
        urlStr += model.rawString()
        return URL(string : urlStr.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)!)
    }
    
    /// Completion closure
    public var completion: (Result<String, SignerError>) -> Void
    
    public init(bundleId: String, completion: @escaping (Result<String, SignerError>) -> Void) {
        self.bundleId = bundleId
        self.completion = completion
    }
    
    public  func handleCallback(url: URL) -> Bool {
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
        
        let wallet = WalletDTO(json: result)
        guard let walletId = wallet?.walletId else {
            return false
        }
        
        completion(.success(walletId))
        return true
    }
}

public extension SignerManager {
    public func getWallet(_ completion: @escaping (Result<String, SignerError>) -> Void) {
//        guard self.hasSignerApp else {
//            return fallbackToInstall()
//        }
        let command = SignWalletCommand(bundleId: self.bundleId, completion: completion)
        execute(command: command)
    }
}
