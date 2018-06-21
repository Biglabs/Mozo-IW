//
//  AddressDTO.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/20/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import SwiftyJSON

public class AddressDTO: Equatable, ResponseObjectSerializable {
    
    public var id: String?
    public var name: String?
    public var time: Int64?
    public var balance: Double?
    public var transactions: [TransactionDTO]?
    
    public required init?(id: String?, time: Int64?, balance: Double?) {
        self.id = id
        self.time = time
        self.balance = balance
    }
    
    public required init?(id: String?, name: String?, time: Int64?, balance: Double?) {
        self.id = id
        self.name = name
        self.time = time
        self.balance = balance
    }
    
    public required init?(id: String?, name: String?, time: Int64?, balance: Double?, transactions: [TransactionDTO]?) {
        self.id = id
        self.name = name
        self.time = time
        self.balance = balance
        self.transactions = transactions
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.id = json["id"].string
        self.name = json["name"].string
        self.time = json["time"].int64
        self.balance = json["balance"].double
        self.transactions = json["transactions"].array?.filter({ TransactionDTO(json: $0) != nil }).map({ TransactionDTO(json: $0)! })
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let id = self.id {
            json["id"] = id
        }
        if let name = self.name {
            json["name"] = name
        }
        if let time = self.time {
            json["time"] =  NSNumber(value: time)
        }
        if let balance = self.balance {
            json["balance"] = balance
        }
        if let transactions = self.transactions {
            json["transactions"] = transactions.map({$0.toJSON()})
        }
        return json
    }
    
    /// Returns a Boolean value indicating whether two values are equal.
    ///
    /// Equality is the inverse of inequality. For any values `a` and `b`,
    /// `a == b` implies that `a != b` is `false`.
    ///
    /// - Parameters:
    ///   - lhs: A value to compare.
    ///   - rhs: Another value to compare.
    public static func ==(lhs: AddressDTO, rhs: AddressDTO) -> Bool {
        return lhs.id == rhs.id
    }
}
