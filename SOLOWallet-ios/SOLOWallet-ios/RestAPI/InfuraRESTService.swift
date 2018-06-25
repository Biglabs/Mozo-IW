//
//  InfuraRESTService.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/25/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import Alamofire
import SwiftyJSON

extension RESTService {
    
    public func getBalance(_ completionHandler: completion = nil) {
        let url = Configuration.ROPSTEN_INFURA_URL
        let params: [String: Any] = ["jsonrpc": "2.0", "id": 1, "method": "eth_getBalance", "params": ["0x771521717F518a32248E435882c625aE94a5434c","latest"]]
        return self.execute(.post, url: url, parameters: params, completionHandler: completionHandler)
    }
}
