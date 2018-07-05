//
//  InputDTO.swift
//  Alamofire
//
//  Created by Tam Nguyen on 7/5/18.
//

import Foundation
import SwiftyJSON

public class InputDTO : ResponseObjectSerializable {
    public var addresses:[String]?
    
    public required init?(addresses: [String]?) {
        self.addresses = addresses
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.addresses = json["addresses"].array?.filter({ $0.string != nil }).map({ $0.string! })
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let addresses = self.addresses {
            json["addresses"] = addresses
        }
        return json
    }
}

public class OutputDTO : InputDTO {
    public var value: Double?
    public required init?(json: SwiftyJSON.JSON) {
        super.init(json: json)
        self.value = json["value"].double
    }
    
    public required init?(){
        super.init()
    }
    
    public required init?(addresses: [String]?, value: Double?) {
        super.init(addresses: addresses)
        self.value = value
    }
    
    public required init?(addresses: [String]?) {
        super.init(addresses: addresses)
    }
    
    public override func toJSON() -> Dictionary<String, Any> {
        var json = super.toJSON()
        if let value = self.value {
            json["value"] = value
        }
        return json
    }
}
