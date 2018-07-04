//
//  BlockCypherAPI.swift
//  SoloSDK
//
//  Created by Hoang Nguyen on 7/4/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation

public extension RESTService {
    // call block cypher for test only
    public func getBalance(_ address: String, completionHandler: completion = nil) {
        let url = Configuration.BLOCK_CYPHER_TEST_URL + "addrs/\(address)/balance"
        return self.execute(.get, url: url, parameters: nil, completionHandler: completionHandler)
    }
    
    public func sendTransaction(_ param: String, completionHandler: completion = nil) {
        let url = Configuration.BLOCK_CYPHER_TEST_URL + "txs/send"
        return self.execute(.post, url: url, parameters: param, completionHandler: completionHandler)
    }
}
