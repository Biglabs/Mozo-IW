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
    public var params: TransactionDTO?
    public var type: String? // coin type
    
    public required init?(action: String?, receiver: String?, params: TransactionDTO?, type: String?) {
        self.action = action
        self.receiver = receiver
        self.params = params
        self.type = type
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.action = json["action"].string
        self.receiver = json["receiver"].string
        self.params = TransactionDTO(json: json["params"])
        self.type = json["type"].string
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
        if let type = self.type {
            json["type"] = type
        }
        return json
    }
    
    func rawString() -> String {
        let json = JSON(self.toJSON())
        return json.rawString()!
    }
}
