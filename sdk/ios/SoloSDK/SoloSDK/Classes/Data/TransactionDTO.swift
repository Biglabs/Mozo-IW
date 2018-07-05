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
    public var signedTransaction: String?
    
    public required init?(id: String?, time: Int64?) {
        self.id = id
        self.time = time
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.id = json["id"].string
        self.block = json["block"].int64
        self.time = json["time"].int64
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
        return json
    }
}

public class EthereumTransactionDTO : TransactionDTO {
    public var value: Double?
    public var gasPrice: Double?
    public var gasLimit : Double?
    public var from: String?
    public var to: String?
    
    public required init?(from: String?, to: String?, value: Double?) {
        super.init()
        self.from = from
        self.to = to
        self.value = value
    }
    
    public required init?(from: String?, to: String?, value: Double?, gasPrice: Double?, gasLimit: Double?) {
        super.init()
        self.from = from
        self.to = to
        self.value = value
        self.gasPrice = gasPrice
        self.gasLimit = gasLimit
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        super.init(json: json)
        self.from = json["from"].string
        self.to = json["to"].string
        self.value = json["value"].double
        self.gasPrice = json["gasPrice"].double
        self.gasLimit = json["gasLimit"].double
    }
    
    public required init?(id: String?, time: Int64?) {
        super.init(id: id, time: time)
    }
    
    public required init?() {
        super.init()
    }
    
    public override func toJSON() -> Dictionary<String, Any> {
        var json = super.toJSON()
        if let from = self.from {
            json["from"] = from
        }
        if let to = self.to {
            json["to"] = to
        }
        if let value = self.value {
            json["value"] = value
        }
        if let gasPrice = self.gasPrice {
            json["gasPrice"] = gasPrice
        }
        if let gasLimit = self.gasLimit {
            json["gasLimit"] = gasLimit
        }
        return json
    }
}

public class BitcoinTransactionDTO : TransactionDTO {
    public var inputs: [InputDTO]?
    public var outputs: [OutputDTO]?
    public var fee: Double? //10000 for BTC
    
    public required convenience init?(inputs : [InputDTO]?, outputs : [OutputDTO]?) {
        self.init()
        self.inputs = inputs
        self.outputs = outputs
    }
    public required init?(json: SwiftyJSON.JSON) {
        super.init(json: json)
        self.inputs = json["inputs"].array?.filter({ InputDTO(json: $0) != nil }).map({ InputDTO(json: $0)! })
        self.outputs = json["outputs"].array?.filter({ OutputDTO(json: $0) != nil }).map({ OutputDTO(json: $0)! })
    }
    
    public required init?(id: String?, time: Int64?) {
        super.init(id: id, time: time)
    }
    
    public required init?() {
        super.init()
    }
    
    public override func toJSON() -> Dictionary<String, Any> {
        var json = super.toJSON()
        if let inputs = self.inputs {
            json["inputs"] = inputs.map({$0.toJSON()})
        }
        if let outputs = self.outputs {
            json["outputs"] =  outputs.map({$0.toJSON()})
        }
        return json
    }
    
}
