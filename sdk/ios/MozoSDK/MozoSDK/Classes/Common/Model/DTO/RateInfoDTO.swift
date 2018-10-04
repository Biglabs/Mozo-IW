//
//  RateInfoDTO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 10/4/18.
//

import Foundation
import SwiftyJSON

public class RateInfoDTO: ResponseObjectSerializable {
    public var currency: String?
    public var rate: Double?
    public var symbol: String?
    
    public required init?(json: SwiftyJSON.JSON) {
        self.currency = json["currency"].string
        self.rate = json["rate"].double
        self.symbol = json["symbol"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let currency = self.currency {
            json["currency"] = currency
        }
        if let rate = self.rate {
            json["rate"] = rate
        }
        if let symbol = self.symbol {
            json["symbol"] = symbol
        }
        return json
    }
}
