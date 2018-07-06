//
//  TransactionDTO.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/21/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import SwiftyJSON

public class TransactionDTO: ResponseObjectSerializable {
    
    public var id: String?
    public var block: Int64?
    public var time: Int64?
    public var gas_price: Double?
    public var gas_limit : Double?
    public var inputs: [InputDTO]?
    public var outputs: [OutputDTO]?
    public var fee: Double?
    public var signedTransaction: String?
    
    public required init?(id: String?, time: Int64?) {
        self.id = id
        self.time = time
    }
    
    public required init?(inputs : [InputDTO]?, outputs : [OutputDTO]?) {
        self.inputs = inputs
        self.outputs = outputs
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.id = json["id"].string
        self.block = json["block"].int64
        self.time = json["time"].int64
        self.inputs = json["inputs"].array?.filter({ InputDTO(json: $0) != nil }).map({ InputDTO(json: $0)! })
        self.outputs = json["outputs"].array?.filter({ OutputDTO(json: $0) != nil }).map({ OutputDTO(json: $0)! })
        self.signedTransaction = json["signedTransaction"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let id = self.id {
            json["id"] = id
        }
        if let block = self.block {
            json["block"] =  NSNumber(value: block)
        }
        if let time = self.time {
            json["time"] =  NSNumber(value: time)
        }
        if let gas_price = self.gas_price {
            json["gas_price"] = gas_price
        }
        if let gas_limit = self.gas_limit {
            json["gas_limit"] = gas_limit
        }
        if let fee = self.fee {
            json["fee"] = fee
        }
        if let inputs = self.inputs {
            json["inputs"] = inputs.map({$0.toJSON()})
        }
        if let outputs = self.outputs {
            json["outputs"] =  outputs.map({$0.toJSON()})
        }
        return json
    }
}

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
