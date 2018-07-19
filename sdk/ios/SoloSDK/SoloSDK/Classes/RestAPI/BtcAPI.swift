//
//  BtcAPI.swift
//  SoloSDK
//
//  Created by Hoang Nguyen on 7/4/18.
//

import Foundation

public extension RESTService {
    // call block cypher for test only
    public func getBtcBalance(_ address: String, completionHandler: completion = nil) {
        let url = Configuration.BASE_URL + "/api/btc/test/addrs/\(address)/balance"
        print(url)
        return self.execute(.get, url: url, parameters: nil, completionHandler: completionHandler)
    }
    
    /// Call API to create a new BTC transaction from an original transaction.
    ///
    /// - Parameters:
    ///   - transaction: the original transaction
    ///   - completionHandler: handle after completed
    public func createNewBtcTransaction(_ transaction: TransactionDTO, completionHandler: completion = nil) {
        let url = Configuration.BASE_URL + "/api/btc/test/txs"
        let param = transaction.toJSON()
        return self.execute(.post, url: url, parameters: param, completionHandler: completionHandler)
    }
    
    public func sendBtcTransaction(_ param: String, completionHandler: completion = nil) {
        let url = Configuration.BASE_URL + "/api/btc/test/txs/send-signed-tx"
        return self.execute(.post, url: url, parameters: param, completionHandler: completionHandler)
    }
    
    /// Call API to get all transaction histories from an address.
    ///
    /// - Parameters:
    ///   - transaction: the address
    ///   - completionHandler: handle after completed
    public func getBtcTransactionHistories(_ address: String, blockHeight: Int64?, completionHandler: completion = nil) {
        var url = Configuration.BASE_URL + "/api/btc/test/addrs/\(address)/txhistory"
        if blockHeight != nil {
            url += "?beforeHeight=" + String(blockHeight ?? 0)
        }
        return self.execute(.get, url: url, completionHandler: completionHandler)
    }
}
