//
//  InfuraAPI.swift
//  SoloSDK
//
//  Created by Tam Nguyen on 6/29/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation

public extension RESTService {
    // call infura for test only
    public func infuraPOST(_ params: [String: Any], completionHandler: completion = nil) {
        return self.execute(.post, url: Configuration.ROPSTEN_INFURA_URL, parameters: params, completionHandler: completionHandler)
    }
}
