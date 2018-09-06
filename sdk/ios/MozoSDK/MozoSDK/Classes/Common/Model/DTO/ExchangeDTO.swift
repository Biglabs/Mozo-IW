//
//  ExchangeDTO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/6/18.
//

import Foundation
import SwiftyJSON

public class ExchangeDTO: ResponseObjectSerializable {
    public var apiKey: String?
    public var secretKey: String?
    
    public required init?(json: SwiftyJSON.JSON) {
        self.apiKey = json["apiKey"].string
        self.secretKey = json["secretKey"].string
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
        return json
    }
}
