//
//  AddressBookDTO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 10/1/18.
//

import Foundation
import SwiftyJSON

public class AddressBookDTO: ResponseObjectSerializable {
    
    public var id: Int64?
    public var ownerUid: String?
    public var name: String?
    public var soloAddress: String?
    
    public required init(name: String, address: String){
        self.name = name
        self.soloAddress = address
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.id = json["id"].int64
        self.ownerUid = json["ownerUid"].string
        self.name = json["name"].string
        self.soloAddress = json["soloAddress"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let id = self.id {
            json["id"] = id
        }
        if let ownerUid = self.ownerUid {
            json["ownerUid"] = ownerUid
        }
        if let name = self.name {
            json["name"] = name
        }
        if let soloAddress = self.soloAddress {
            json["soloAddress"] = soloAddress
        }
        return json
    }
    
    public static func arrayFromJson(_ json: SwiftyJSON.JSON) -> [AddressBookDTO] {
        let array = json.array?.filter({ AddressBookDTO(json: $0) != nil }).map({ AddressBookDTO(json: $0)! })
        return array ?? []
    }
    
    public static func arrayContainsItem(_ address: String, array: [AddressBookDTO]) -> Bool {
        return array.contains { $0.soloAddress?.lowercased() == address.lowercased() }
    }
}
