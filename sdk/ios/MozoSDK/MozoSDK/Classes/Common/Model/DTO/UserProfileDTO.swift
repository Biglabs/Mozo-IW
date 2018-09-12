//
//  UserProfileDTO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/5/18.
//

import Foundation
import SwiftyJSON

public class UserProfileDTO: Codable, ResponseObjectSerializable {
    public var id: Int?
    public var userId: String?
    public var status: String?
    
    public var walletInfo: String?
    public var exchangeInfo: ExchangeInfoDTO?
    public var settings: String?
    
    public required init?(json: SwiftyJSON.JSON) {
        self.id = json["id"].int
        self.userId = json["userId"].string
        self.status = json["status"].string
        self.walletInfo = json["walletInfo"].string
        self.exchangeInfo = ExchangeInfoDTO(json: json["exchangeInfo"])
        self.settings = json["settings"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let id = self.id {
            json["id"] = id
        }
        if let userId = self.userId {
            json["userId"] = userId
        }
        if let status = self.status {
            json["status"] = status
        }
        if let settings = self.settings {
            json["settings"] = settings
        }
        return json
    }
}
