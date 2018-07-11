//
//  InputDTO.swift
//  Alamofire
//
//  Created by Tam Nguyen on 7/5/18.
//

import Foundation
import SwiftyJSON

public class InputDTO : ResponseObjectSerializable {
    /// An array of public addresses associated with the output of the previous transaction.
    public var addresses:[String]?
    
    /// The previous transaction hash where this input was an output. Not present for coinbase transactions.
    public var prev_hash: String?
    
    /// The index of the output being spent within the previous transaction. Not present for coinbase transactions.
    public var output_index: Int64?
    
    /// The value of the output being spent within the previous transaction. Not present for coinbase transactions.
    public var output_value: Int64?
    
    /// The type of script that encumbers the output corresponding to this input.
    public var script_type: String?
    
    /// Raw hexadecimal encoding of the script.
    public var script: String?
    
    /// Legacy 4-byte sequence number, not usually relevant unless dealing with locktime encumbrances.
    public var sequence: Int64?
    
    public required init?(addresses: [String]?) {
        self.addresses = addresses
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.addresses = json["addresses"].array?.filter({ $0.string != nil }).map({ $0.string! })
        self.prev_hash = json["prev_hash"].string
        self.output_index = json["output_index"].int64
        self.output_value = json["output_value"].int64
        self.script_type = json["script_type"].string
        self.script = json["script"].string
        self.sequence = json["sequence"].int64
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let addresses = self.addresses {
            json["addresses"] = addresses
        }
        if let prev_hash = self.prev_hash {
            json["prev_hash"] = prev_hash
        }
        if let output_index = self.output_index {
            json["output_index"] = output_index
        }
        if let output_value = self.output_value {
            json["output_value"] = output_value
        }
        if let script_type = self.script_type {
            json["script_type"] = script_type
        }
        if let script = self.script {
            json["script"] = script
        }
        if let sequence = self.sequence {
            json["sequence"] = sequence
        }
        return json
    }
}
