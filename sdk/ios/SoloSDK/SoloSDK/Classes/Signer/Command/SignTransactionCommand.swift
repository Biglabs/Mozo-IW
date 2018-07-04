//
//  SignTransactionCommand.swift
//  Alamofire
//
//  Created by Tam Nguyen on 6/30/18.
//

import Foundation
import Result
import SwiftyJSON

public final class SignTransactionCommand: Command {
    
    public let name = "SIGN"
    
    public var bundleId: String
    
    public var coinType: String
    
    public var transaction: TransactionDTO?
    
    public func requestURL() -> URL? {
        var urlStr = Configuration.SIGNER_URL_SCHEME + "://"
        let model = CommunicationDTO(action: self.name, receiver: "\(self.bundleId).\(Configuration.WALLET_URL_SCHEME)", params: transaction, coinType: coinType)!
        urlStr += model.rawString()
        return URL(string : urlStr.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)!)
    }
    
    /// Completion closure
    public var completion: (Result<String, SignerError>) -> Void
    
    /// Callback scheme
    public var callbackScheme: String?
    
    public func requestURL(scheme: String) -> URL {
        return URL(string : scheme.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)!)!
    }
    
    public var callback: URL {
        var components = URLComponents()
        components.scheme = callbackScheme
        components.host = name
        return components.url!
    }
    
    public init(bundleId: String, coinType: String, transaction: TransactionDTO, callbackScheme: String? = nil, completion: @escaping (Result<String, SignerError>) -> Void) {
        self.bundleId = bundleId
        self.coinType = coinType
        self.transaction = transaction
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
        
        // Handle error
//        if let errorCode = Int("Error name"), let error = SignerError(rawValue: errorCode) {
//            completion(.failure(error))
//        }
        
        guard let action = com?.action, action == self.name else {
            return false
        }
        
        guard let result = com?.result else {
            return false
        }
        
        let transaction = TransactionDTO(json: result)
        guard let signedTransaction = transaction?.signedTransaction else {
            return false
        }
        
        completion(.success(signedTransaction))
        return true
    }
}

public extension SignerManager {
    public func signTransactionETH(fromAddress: String, toAddress: String, value: Double, coinType: String, completion: @escaping (Result<String, SignerError>) -> Void) {
        let transaction = ETH_TransactionDTO()!
        transaction.from = fromAddress
        transaction.to = toAddress
        transaction.value = Double(value)
        let command = SignTransactionCommand(bundleId: self.bundleId, coinType: coinType, transaction: transaction, completion: completion)
        execute(command: command)
    }
    
    public func signTransactionBTC(inputs: [InputDTO], outputs: [OutputDTO], coinType: String, completion: @escaping (Result<String, SignerError>) -> Void) {
        let transaction = BTC_TransactionDTO()!
        transaction.inputs = inputs
        transaction.outputs = outputs
        let command = SignTransactionCommand(bundleId: self.bundleId, coinType: coinType, transaction: transaction, completion: completion)
        execute(command: command)
    }
}
