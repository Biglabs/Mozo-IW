//
//  WalletRESTService.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/22/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import Alamofire
import SwiftyJSON

extension RESTService {
    
    public func getAddresses(completionHandler: completion = nil){
        let url = Configuration.BASE_URL + "/api/addresses"
        return self.execute(.get, url: url, completionHandler: completionHandler)
    }
}
