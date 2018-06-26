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
    
    public func infuraPOST(_ params: [String: Any], completionHandler: completion = nil) {
        let url = Configuration.ROPSTEN_INFURA_URL
        return self.execute(.post, url: url, parameters: params, completionHandler: completionHandler)
    }
}
