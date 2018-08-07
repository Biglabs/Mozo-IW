//
//  TokenAPI.swift
//  SoloSDK
//
//  Created by Hoang Nguyen on 8/6/18.
//

import Foundation

public extension RESTService {
    /// Call API to get token balance.
    ///
    /// - Parameters:
    ///   - address: the address
    ///   - network: the network
    ///   - symbol: the symbol of token
    ///   - completionHandler: handle after completed
    public func getTokenBalance(_ address: String, network: String, symbol: String, completionHandler: completion = nil) {
        let networkPath = self.extractNetworkPathFromText(network: network)
        let url = Configuration.BASE_URL + "/api/token/\(networkPath)/\(address)/balance?symbol=\(symbol)"
        return self.execute(.get, url: url, parameters: nil, completionHandler: completionHandler)
    }
    
    /// Call API to create a new token transaction from an original transaction.
    ///
    /// - Parameters:
    ///   - transaction: the original transaction
    ///   - completionHandler: handle after completed
    public func createNewTokenTransaction(_ transaction: TransactionDTO, network: String, completionHandler: completion = nil) {
        let networkPath = self.extractNetworkPathFromText(network: network)
        let url = Configuration.BASE_URL + "/api/token/\(networkPath)/txs/transfer"
        let param = transaction.toJSON()
        return self.execute(.post, url: url, parameters: param, completionHandler: completionHandler)
    }
    
    /// Send a signed TOKEN transaction to server.
    ///
    /// - Parameters:
    ///   - param: the parameters
    ///   - network: the network
    ///   - completionHandler: handle after completed
    public func sendTokenTransaction(_ param: Any, network: String, completionHandler: completion = nil) {
        let networkPath = self.extractNetworkPathFromText(network: network)
        let url = Configuration.BASE_URL + "/api/token/\(networkPath)/txs/send-transfer-tx"
        return self.execute(.post, url: url, parameters: param, completionHandler: completionHandler)
    }
    
    /// Call API to get all transaction histories from an address.
    ///
    /// - Parameters:
    ///   - address: the address
    ///   - network: the network
    ///   - blockHeight: the block height of a transaction history.
    ///   - completionHandler: handle after completed
    public func getTokenTransactionHistories(_ address: String, network: String, blockHeight: Int64?, completionHandler: completion = nil) {
        let networkPath = self.extractNetworkPathFromText(network: network)
        var url = Configuration.BASE_URL + "/api/token/\(networkPath)/addrs/\(address)/txhistory"
        if blockHeight != nil {
            url += "?beforeHeight=" + String(blockHeight ?? 0)
        }
        return self.execute(.get, url: url, completionHandler: completionHandler)
    }
}
