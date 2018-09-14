//
//  AnonymousUserDTO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/14/18.
//

import Foundation
import SwiftyJSON

public class AnonymousUserDTO: ResponseObjectSerializable {
    public var id: String?
    public var offchainBalance: Int64?
    public var token: String?
    public var uuid: String?
    
    public required init(uuid: String?){
        self.uuid = uuid
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.id = json["id"].string
        self.offchainBalance = json["offchainBalance"].int64
        self.token = json["token"].string
        self.uuid = json["uuid"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let id = self.id {
            json["id"] = id
        }
        if let offchainBalance = self.offchainBalance {
            json["offchainBalance"] = offchainBalance
        }
        if let token = self.token {
            json["token"] = token
        }
        if let uuid = self.uuid {
            json["uuid"] = uuid
        }
        return json
    }
    
    func rawData() -> Data? {
        let json = JSON(self.toJSON())
        return try? json.rawData()
    }
}
