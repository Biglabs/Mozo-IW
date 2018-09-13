//
//  UserDTO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/6/18.
//

import Foundation
import SwiftyJSON

public class UserDTO: Codable, ResponseObjectSerializable {
    public var id: String?
    public var name: String?
    public var profile: UserProfileDTO?
    
    public required init(id: String?, name: String? = nil, profile: UserProfileDTO?){
        self.id = id
        self.name = name
        self.profile = profile
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.id = json["id"].string
        self.name = json["name"].string
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
        return json
    }
}
