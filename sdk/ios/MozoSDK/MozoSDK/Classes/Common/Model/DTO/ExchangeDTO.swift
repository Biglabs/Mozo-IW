//
//  ExchangeDTO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/6/18.
//

import Foundation
import SwiftyJSON

public class ExchangeInfoDTO: Codable, ResponseObjectSerializable {
    public var apiKey: String?
    public var secretKey: String?
    public var depositAddress: String?
    public var exchangeId: String?
    public var exchangePlatform: String?
    
    public required init?(json: SwiftyJSON.JSON) {
        self.apiKey = json["apiKey"].string
        self.secretKey = json["secretKey"].string
        self.depositAddress = json["depositAddress"].string
        self.exchangeId = json["exchangeId"].string
        self.exchangePlatform = json["exchangePlatform"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let apiKey = self.apiKey {
            json["apiKey"] = apiKey
        }
        if let secretKey = self.secretKey {
            json["secretKey"] = secretKey
        }
        if let depositAddress = self.depositAddress {
            json["depositAddress"] = depositAddress
        }
        if let exchangeId = self.exchangeId {
            json["exchangeId"] = exchangeId
        }
        if let exchangePlatform = self.exchangePlatform {
            json["exchangePlatform"] = exchangePlatform
        }
        return json
    }
    
    func rawData() -> Data? {
        let json = JSON(self.toJSON())
        return try? json.rawData()
    }
}
