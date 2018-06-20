//
//  CoinDTO.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/20/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import SwiftyJSON

public class CoinDTO: ResponseObjectSerializable {
    
    public var id: Int?
    public var name: String?
    public var addesses: [AddressDTO]?
    
    public required init?(json: SwiftyJSON.JSON) {
        self.id = json["id"].int
        self.name = json["name"].string
        self.addesses = json["addesses"].array?.filter({ AddressDTO(json: $0) != nil }).map({ AddressDTO(json: $0)! })
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
        if let addesses = self.addesses {
            json["addesses"] = addesses.map({$0.toJSON()})
        }
        return json
    }
}
