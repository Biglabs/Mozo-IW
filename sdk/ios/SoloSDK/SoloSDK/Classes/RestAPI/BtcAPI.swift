//
//  BtcAPI.swift
//  SoloSDK
//
//  Created by Hoang Nguyen on 7/4/18.
//

import Foundation

public extension RESTService {
    // call block cypher for test only
    public func getBtcBalance(_ address: String, network: String, completionHandler: completion = nil) {
        let networkPath = self.convertNetworkToPath(network: network)
        let url = Configuration.BASE_URL + "/api/\(networkPath)/addrs/\(address)/balance"
        print(url)
        return self.execute(.get, url: url, parameters: nil, completionHandler: completionHandler)
    }
    
    /// Call API to create a new BTC transaction from an original transaction.
    ///
    /// - Parameters:
    ///   - transaction: the original transaction
    ///   - completionHandler: handle after completed
    public func createNewBtcTransaction(_ transaction: TransactionDTO, network: String, completionHandler: completion = nil) {
        let networkPath = self.convertNetworkToPath(network: network)
        let url = Configuration.BASE_URL + "/api/\(networkPath)/txs"
        let param = transaction.toJSON()
        return self.execute(.post, url: url, parameters: param, completionHandler: completionHandler)
    }
    
    public func sendBtcTransaction(_ param: String, network: String, completionHandler: completion = nil) {
        let networkPath = self.convertNetworkToPath(network: network)
        let url = Configuration.BASE_URL + "/api/\(networkPath)/txs/send-signed-tx"
        return self.execute(.post, url: url, parameters: param, completionHandler: completionHandler)
    }
    
    /// Call API to get all transaction histories from an address.
    ///
    /// - Parameters:
    ///   - address: the address
    ///   - network: the network
    ///   - completionHandler: handle after completed
    public func getBtcTransactionHistories(_ address: String, network: String, blockHeight: Int64?, completionHandler: completion = nil) {
        let networkPath = self.convertNetworkToPath(network: network)
        var url = Configuration.BASE_URL + "/api/\(networkPath)/addrs/\(address)/txhistory"
        if blockHeight != nil {
            url += "?beforeHeight=" + String(blockHeight ?? 0)
        }
        return self.execute(.get, url: url, completionHandler: completionHandler)
    }
}
