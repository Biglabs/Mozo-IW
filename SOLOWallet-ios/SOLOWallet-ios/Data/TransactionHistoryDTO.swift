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
    public var action: String?
    public var addressTo: String?
    public var amount: Int64?
    public var blockHeight: Int64?
    public var confirmations: Int64?
    public var fees: Int64?
    public var message: String?
    public var time: Int64?
    public var txHash: String?
    
    public required init?(json: SwiftyJSON.JSON) {
        self.action = json["action"].string
        self.addressTo = json["addressTo"].string
        self.amount = json["amount"].int64
        self.blockHeight = json["blockHeight"].int64
        self.confirmations = json["confirmations"].int64
        self.fees = json["fees"].int64
        self.message = json["message"].string
        self.time = json["time"].int64
        self.txHash = json["txHash"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let action = self.action {
            json["action"] = action
        }
        if let addressTo = self.addressTo {
            json["addressTo"] =  addressTo
        }
        if let amount = self.amount {
            json["amount"] = amount
        }
        if let blockHeight = self.blockHeight {
            json["blockHeight"] =  blockHeight
        }
        if let confirmations = self.confirmations {
            json["confirmations"] = confirmations
        }
        if let fees = self.fees {
            json["fees"] =  fees
        }
        if let message = self.message {
            json["message"] = message
        }
        if let txHash = self.txHash {
            json["txHash"] =  txHash
        }
        if let time = self.time {
            json["time"] =  NSNumber(value: time)
        }
        return json
    }
}
