//
//  EthAPI.swift
//  SoloSDK
//
//  Created by Hoang Nguyen on 7/6/18.
//

import Foundation

public extension RESTService {
    // call block cypher for test only
    public func getEthBalance(_ address: String, completionHandler: completion = nil) {
        let url = Configuration.BASE_URL + "/api/eth/test/addrs/\(address)/balance"
        print(url)
        return self.execute(.get, url: url, parameters: nil, completionHandler: completionHandler)
    }
    
    public func sendEthTransaction(_ param: Any, completionHandler: completion = nil) {
        let url = Configuration.BASE_URL + "/api/eth/test/txs/send-signed-tx"
        return self.execute(.post, url: url, parameters: param, completionHandler: completionHandler)
    }
}
