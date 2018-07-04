//
//  TransactionHistoryDTO.swift
//  SOLOWallet-ios
//
//  Created by Hoang Nguyen on 7/4/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import SwiftyJSON

public class TransactionHistoryDTO: ResponseObjectSerializable {
    public var id: String?
    public var block: Int64?
    public var time: Int64?
    
    public required init?(id: String?, time: Int64?) {
        self.id = id
        self.time = time
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.id = json["id"].string
        self.block = json["block"].int64
        self.time = json["time"].int64
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
        return json
    }
}
