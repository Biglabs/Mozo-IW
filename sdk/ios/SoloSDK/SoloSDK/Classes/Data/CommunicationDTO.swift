//
//  CommunicationDTO.swift
//  SOLOWallet-ios
//
//  Created by Hoang Nguyen on 6/25/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import SwiftyJSON
public class CommunicationDTO: ResponseObjectSerializable {
    
    public var action: String?
    public var receiver: String?
    public var params: IntermediaryTransactionDTO?
    public var coinType: String?
    public var result: SwiftyJSON.JSON?
    public var network: String?
    
    public required init?(action: String?, receiver: String?, params: IntermediaryTransactionDTO?, coinType: String?, network: String?) {
        self.action = action
        self.receiver = receiver
        self.params = params
        self.coinType = coinType
        self.network = network
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.action = json["action"].string
        self.receiver = json["receiver"].string
        self.params = IntermediaryTransactionDTO(json: json["params"])
        self.coinType = json["coinType"].string
        self.result = SwiftyJSON.JSON(json["result"].dictionary!)
        self.network = json["network"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let action = self.action {
            json["action"] = action
        }
        if let receiver = self.receiver {
            json["receiver"] = receiver
        }
        if let params = self.params {
            json["params"] = params.toJSON()
        }
        if let coinType = self.coinType {
            json["coinType"] = coinType
        }
        if let network = self.network {
            json["network"] = network
        }
        return json
    }
    
    func rawString() -> String {
        let json = JSON(self.toJSON())
        return json.rawString()!
    }
}
