//
//  UserProfileDTO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/5/18.
//

import Foundation
import SwiftyJSON

public class UserProfileDTO: Codable, ResponseObjectSerializable {
    public var id: String?
    public var wallet: String?
    public var exchange: String?
    public var settings: String?
    
    public required init?(json: SwiftyJSON.JSON) {
        self.id = json["id"].string
        self.wallet = json["wallet"].string
        self.exchange = json["exchange"].string
        self.settings = json["settings"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let id = self.id {
            json["id"] = id
        }
        if let wallet = self.wallet {
            json["wallet"] = wallet
        }
        if let exchange = self.exchange {
            json["exchange"] = exchange
        }
        if let settings = self.settings {
            json["settings"] = settings
        }
        return json
    }
}
