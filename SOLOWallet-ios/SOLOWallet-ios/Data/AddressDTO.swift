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
    public var age: Int64?
    public var balance: Double?
    public var usd: Double?
    
    public required init?(id: String?, age: Int64?, balance: Double?) {
        self.id = id
        self.age = age
        self.balance = balance
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.id = json["id"].string
        self.age = json["age"].int64
        self.balance = json["balance"].double
        self.usd = json["usd"].double
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let id = self.id {
            json["id"] = id
        }
        if let age = self.age {
            json["age"] =  NSNumber(value: age)
        }
        if let balance = self.balance {
            json["balance"] = NSNumber(value: balance)
        }
        if let usd = self.usd {
            json["usd"] = NSNumber(value: usd)
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
