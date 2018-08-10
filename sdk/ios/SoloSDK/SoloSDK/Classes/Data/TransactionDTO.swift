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
    
    public var block_hash: String?
    
    /// Height of the block that contains this transaction. If this is an unconfirmed transaction, it will equal -1.
    public var block_height: Int64?
    
    /// BTC: The hash of the transaction. While reasonably unique, using hashes as identifiers may be unsafe.
    /// ETH: The hash of the transaction.
    public var hash: String?
    
    /// Array of public addresses involved in the transaction.
    public var addresses: [String]?
    
    /// BTC: The total number of satoshis exchanged in this transaction.
    /// ETH: The total number of wei exchanged in this transaction.
    public var total: NSNumber?
    
    /// BTC: The total number of fees—in satoshis—collected by miners in this transaction.
    /// ETH: The total number of fees—in wei—collected by miners in this transaction. Equal to gas_price * gas_used.
    public var fees: NSNumber?
    
    /// The size of the transaction in bytes.
    public var size: Int64?
    
    /// BTC only: The likelihood that this transaction will make it to the next block; reflects the preference level miners have to include this transaction. Can be high, medium or low.
    public var preference: String?
    
    /// ETH only: The amount of gas used by this transaction.
    public var gas_used: Int64?
    
    /// ETH only: The price of gas—in wei—in this transaction.
    public var gas_price: Int64?
    
    /// BTC: Address of the peer that sent BlockCypher’s servers this transaction.
    /// ETH: Address of the peer that sent BlockCypher’s servers this transaction. May be empty.
    public var relayed_by: String?
    
    public var receive_count: Int64?
    
    /// Time this transaction was received by BlockCypher’s servers.
    public var received: String?
    
    /// BTC: Version number, typically 1 for Bitcoin transactions.
    /// ETH: Version number of this transaction.
    public var ver: Int64?
    
    /// BTC only: Time when transaction can be valid. Can be interpreted in two ways: if less than 500 million, refers to block height. If more, refers to Unix epoch time.
    public var lock_time: Int64?
    
    public var data: String?
    
    public var doubleSpendTx: String?
    
    /// true if this is an attempted double spend; false otherwise.
    public var double_spend: Bool?
    
    /// Total number of inputs in the transaction.
    public var vin_sz: Int64?
    
    /// Total number of outputs in the transaction.
    public var vout_sz: Int64?
    
    public var confidence: NSNumber?
    
    /// Number of subsequent blocks, including the block the transaction is in. Unconfirmed transactions have 0 confirmations.
    public var confirmations: Int64?
    
    public var confirmed: String?
    
    /// TXInput Array, limited to 20 by default.
    public var inputs: [InputDTO]?
    
    /// TXOutput Array, limited to 20 by default.
    public var outputs: [OutputDTO]?
    
    /// Optional If creating a transaction, can optionally set a higher default gas limit (useful if your recepient is a contract). If not set, default is 21000 gas for external accounts and 80000 for contract accounts.
    public var gas_limit: Int64?
    
    public required init?(inputs : [InputDTO]?, outputs : [OutputDTO]?) {
        self.inputs = inputs
        self.outputs = outputs
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.block_height = json["block_height"].int64
        self.hash = json["hash"].string
        self.addresses = json["addresses"].array?.filter({ $0.string != nil }).map({ $0.string! })
        self.total = json["total"].number
        self.fees = json["fees"].number
        self.size = json["size"].int64
        self.preference = json["preference"].string
        self.gas_used = json["gas_used"].int64
        self.gas_price = json["gas_price"].int64
        self.relayed_by = json["relayed_by"].string
        self.received = json["received"].string
        self.ver = json["ver"].int64
        self.lock_time = json["lock_time"].int64
        self.double_spend = json["double_spend"].bool
        self.vin_sz = json["vin_sz"].int64
        self.vout_sz = json["vout_sz"].int64
        self.confirmations = json["confirmations"].int64
        self.inputs = json["inputs"].array?.filter({ InputDTO(json: $0) != nil }).map({ InputDTO(json: $0)! })
        self.outputs = json["outputs"].array?.filter({ OutputDTO(json: $0) != nil }).map({ OutputDTO(json: $0)! })
        self.gas_limit = json["gas_limit"].int64
        self.block_hash = json["block_hash"].string
        self.confidence = json["confidence"].number
        self.confirmed = json["confirmed"].string
        self.data = json["data"].string
        self.doubleSpendTx = json["doubleSpendTx"].string
        self.receive_count = json["receive_count"].int64
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let block_height = self.block_height {
            json["block_height"] = NSNumber(value: block_height)
        }
        if let hash = self.hash {
            json["hash"] = hash
        }
        if let addresses = self.addresses {
            json["addresses"] = addresses
        }
        if let total = self.total {
            json["total"] = total
        }
        if let fees = self.fees {
            json["fees"] = fees
        }
        if let size = self.size {
            json["size"] = size
        }
        if let preference = self.preference {
            json["preference"] = preference
        }
        if let gas_used = self.gas_used {
            json["gas_used"] = gas_used
        }
        if let gas_price = self.gas_price {
            json["gas_price"] = gas_price
        }
        if let relayed_by = self.relayed_by {
            json["relayed_by"] = relayed_by
        }
        if let received = self.received {
            json["received"] = received
        }
        if let ver = self.ver {
            json["ver"] = ver
        }
        if let lock_time = self.lock_time {
            json["lock_time"] = lock_time
        }
        if let double_spend = self.double_spend {
            json["double_spend"] = double_spend
        }
        if let vin_sz = self.vin_sz {
            json["vin_sz"] = vin_sz
        }
        if let vout_sz = self.vout_sz {
            json["vout_sz"] = vout_sz
        }
        if let confirmations = self.confirmations {
            json["confirmations"] = confirmations
        }
        if let inputs = self.inputs {
            json["inputs"] = inputs.map({$0.toJSON()})
        }
        if let outputs = self.outputs {
            json["outputs"] =  outputs.map({$0.toJSON()})
        }
        if let gas_limit = self.gas_limit {
            json["gas_limit"] = gas_limit
        }
        if let block_hash = self.block_hash {
            json["block_hash"] = block_hash
        }
        if let confidence = self.confidence {
            json["confidence"] = confidence
        }
        if let confirmed = self.confirmed {
            json["confirmed"] = confirmed
        }
        if let data = self.data {
            json["data"] = data
        }
        if let doubleSpendTx = self.doubleSpendTx {
            json["doubleSpendTx"] = doubleSpendTx
        }
        if let receive_count = self.receive_count {
            json["receive_count"] = receive_count
        }
        return json
    }
}
