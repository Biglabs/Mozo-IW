//
//  WalletAddressesAPI.swift
//  SoloSDK
//
//  Created by Tam Nguyen on 6/29/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation

public extension SoloSDK {
    // get addresses by wallet id
    public func getAddresses(_ id: String, completionHandler: completion = nil) {
        let url = BASE_URL + "/api/wallets/\(id)/addresses"
        return self.execute(.get, url: url, completionHandler: completionHandler)
    }
}
