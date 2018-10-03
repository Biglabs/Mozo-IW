//
//  TxHistoryDTO.swift
//  MozoSDK
//
//  Created by HoangNguyen on 10/2/18.
//

import Foundation
import SwiftyJSON

public class TxHistoryDTO: ResponseObjectSerializable {
    public var action: String?
    public var addressFrom: String?
    public var addressTo: String?
    public var amount: NSNumber?
    public var blockHeight: Int64?
    public var confirmations: Int64?
    public var contractAction: String?
    public var contractAddress: String?
    public var decimal: Int64?
    public var fees: NSNumber?
    public var message: String?
    public var symbol: String?
    public var time: Int64?
    public var txHash: String?
    
    public required init?(json: SwiftyJSON.JSON) {
        self.action = json["action"].string
        self.addressFrom = json["addressFrom"].string
        self.addressTo = json["addressTo"].string
        self.amount = json["amount"].number
        self.blockHeight = json["blockHeight"].int64
        self.confirmations = json["confirmations"].int64
        self.contractAction = json["contractAction"].string
        self.contractAddress = json["contractAddress"].string
        self.decimal = json["decimal"].int64
        self.fees = json["fees"].number
        self.message = json["message"].string
        self.symbol = json["symbol"].string
        self.time = json["time"].int64
        self.txHash = json["txHash"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let action = self.action {
            json["action"] = action
        }
        if let addressFrom = self.addressFrom {
            json["addressFrom"] = addressFrom
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
        if let contractAction = self.contractAction {
            json["contractAction"] = contractAction
        }
        if let contractAddress = self.contractAddress {
            json["contractAddress"] = contractAddress
        }
        if let decimal = self.decimal {
            json["decimal"] = NSNumber(value: decimal)
        }
        if let fees = self.fees {
            json["fees"] =  fees
        }
        if let message = self.message {
            json["message"] = message
        }
        if let symbol = self.symbol {
            json["symbol"] = symbol
        }
        if let txHash = self.txHash {
            json["txHash"] = txHash
        }
        if let time = self.time {
            json["time"] = NSNumber(value: time)
        }
        return json
    }
    
    public static func arrayFromJson(_ json: SwiftyJSON.JSON) -> [TxHistoryDTO] {
        let array = json.array?.map({ TxHistoryDTO(json: $0)! })
        return array ?? []
    }
}
