//
//  SoloSDK.swift
//  SoloSDK
//
//  Created by Tam Nguyen on 6/29/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import Alamofire

@objc(SoloSDK)
public final class SoloSDK: NSObject {
    
    public var BASE_URL = "http://192.168.1.98:9000"
    public var ROPSTEN_INFURA_URL = "https://ropsten.infura.io/V2vOGBNVvlHlDJQ17sIL"
    public let command: RESTService?
    
    @objc public override init() {
        self.command = RESTService()
    }
    
    public func execute(_ method: Alamofire.HTTPMethod, url: String, parameters: Any? = nil, completionHandler: completion = nil) {
        if parameters == nil {
            self.command?.execute(method, url: url, params: nil, completionHandler: completionHandler)
        } else if let params = parameters as? [String: Any] {
            self.command?.execute(method, url: url, params: params, completionHandler: completionHandler)
        } else if let param = parameters as? String {
            self.command?.execute(method, url: url, param: param, completionHandler: completionHandler)
        } else {
            self.command?.execute(method, url: url, body: parameters!, completionHandler: completionHandler)
        }
    }
}
