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
    public var address: String?
    public var coin: String?
    public var balance: Double?
    public var network: String?
    public var transactions: [TransactionHistoryDTO]?
    
    // 1 coin = usd
    public var usd: Double?
    
    public required init?(id: String?, address: String?, coin: String?, balance: Double?, network: String?, transactions: [TransactionHistoryDTO]?) {
        self.id = id
        self.address = address
        self.coin = coin
        self.balance = balance
        self.network = network
        self.transactions = transactions
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.id = json["id"].string
        self.address = json["address"].string
        self.coin = json["coin"].string
        self.balance = json["balance"].double
        self.network = json["network"].string
        self.transactions = json["transactions"].array?.filter({ TransactionHistoryDTO(json: $0) != nil }).map({ TransactionHistoryDTO(json: $0)! })
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let id = self.id {
            json["id"] = id
        }
        if let address = self.address {
            json["address"] = address
        }
        if let coin = self.coin {
            json["coin"] =  coin
        }
        if let balance = self.balance {
            json["balance"] = balance
        }
        if let network = self.network {
            json["network"] = network
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
