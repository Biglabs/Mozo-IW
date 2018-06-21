//
//  TransactionDTO.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/21/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import SwiftyJSON

public class TransactionDTO: ResponseObjectSerializable {
    
    public var id: String?
    public var block: Int64?
    public var time: Int64?
    public var from: String?
    public var to: String?
    public var value: Double?
    public var fee: Double?
    
    public required init?(id: String?, time: Int64?, from: String?, to: String?, value: Double?, fee: Double?) {
        self.id = id
        self.time = time
        self.from = from
        self.to = to
        self.value = value
        self.fee = fee
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.id = json["id"].string
        self.block = json["block"].int64
        self.time = json["time"].int64
        self.from = json["from"].string
        self.to = json["to"].string
        self.value = json["value"].double
        self.fee = json["fee"].double
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let id = self.id {
            json["id"] = id
        }
        if let block = self.block {
            json["block"] =  NSNumber(value: block)
        }
        if let time = self.time {
            json["time"] =  NSNumber(value: time)
        }
        if let from = self.from {
            json["from"] = from
        }
        if let to = self.to {
            json["to"] = to
        }
        if let value = self.value {
            json["value"] = value
        }
        if let fee = self.fee {
            json["fee"] = fee
        }
        return json
    }
}
