//
//  OutputDTO.swift
//  SoloSDK
//
//  Created by Hoang Nguyen on 7/10/18.
//

import Foundation
import SwiftyJSON

public class OutputDTO : ResponseObjectSerializable {
    /// Addresses that correspond to this output; typically this will only have a single address, and you can think of this output as having “sent” value to the address contained herein.
    public var addresses:[String]?
    
    /// Raw hexadecimal encoding of the encumbrance script for this output.
    public var script: String?
    
    /// BTC: Value in this transaction output, in satoshis.
    /// ETH: Value in this transaction output, in wei.
    public var value: NSNumber?
    
    /// The type of script that encumbers the output corresponding to this input.
    public var script_type: String?
    
    /// Optional The transaction hash that spent this output. Only returned for outputs that have been spent. The spending transaction may be unconfirmed.
    public var spent_by: String?
    
    /// Optional A hex-encoded representation of an OP_RETURN data output, without any other script instructions. Only returned for outputs whose script_type is null-data.
    public var data_hex: String?
    
    /// Optional An ASCII representation of an OP_RETURN data output, without any other script instructions. Only returned for outputs whose script_type is null-data and if its data falls into the visible ASCII range.
    public var data_string: String?
    
    public required init?(addresses: [String]?, value: NSNumber?) {
        self.addresses = addresses
        self.value = value
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.addresses = json["addresses"].array?.filter({ $0.string != nil }).map({ $0.string! })
        self.value = json["value"].number
        self.spent_by = json["spent_by"].string
        self.script_type = json["prev_hash"].string
        self.script = json["prev_hash"].string
        self.data_hex = json["data_hex"].string
        self.data_string = json["data_string"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let addresses = self.addresses {
            json["addresses"] = addresses
        }
        if let value = self.value {
            json["value"] = value
        }
        if let spent_by = self.spent_by {
            json["spent_by"] = spent_by
        }
        if let data_hex = self.data_hex {
            json["data_hex"] = data_hex
        }
        if let script_type = self.script_type {
            json["script_type"] = script_type
        }
        if let script = self.script {
            json["script"] = script
        }
        if let data_string = self.data_string {
            json["data_string"] = data_string
        }
        return json
    }
}
