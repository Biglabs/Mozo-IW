//
//  ContractDTO.swift
//  SoloSDK
//
//  Created by Hoang Nguyen on 8/9/18.
//

import Foundation
import SwiftyJSON

public class ContractDTO: ResponseObjectSerializable {
    
    public var contractAddress: String?
    public var decimals: Int?
    public var symbol: String?
    public var totalSupply: Int?
    
    public required init?(json: SwiftyJSON.JSON) {
        self.contractAddress = json["contractAddress"].string
        self.symbol = json["symbol"].string
        self.decimals = json["decimals"].int
        self.totalSupply = json["totalSupply"].int
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let contractAddress = self.contractAddress {
            json["contractAddress"] = contractAddress
        }
        if let symbol = self.symbol {
            json["symbol"] = symbol
        }
        if let decimals = self.decimals {
            json["decimals"] =  decimals
        }
        if let totalSupply = self.totalSupply {
            json["totalSupply"] = totalSupply
        }
        return json
    }
}
