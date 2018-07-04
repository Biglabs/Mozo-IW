//
//  BtcAPI.swift
//  SoloSDK
//
//  Created by Hoang Nguyen on 7/4/18.
//

import Foundation

public extension RESTService {
    // call block cypher for test only
    public func getBalance(_ address: String, completionHandler: completion = nil) {
        let url = Configuration.BASE_URL + "api/btc/test/\(address)/balance"
        return self.execute(.get, url: url, parameters: nil, completionHandler: completionHandler)
    }
    
    public func sendTransaction(_ param: String, completionHandler: completion = nil) {
        let url = Configuration.BASE_URL + "api/btc/test/txs/send-signed-tx"
        return self.execute(.post, url: url, parameters: param, completionHandler: completionHandler)
    }
}
