//
//  IntermediaryTransactionDTO.swift
//  SoloSDK
//
//  Created by Hoang Nguyen on 7/9/18.
//

import Foundation
import SwiftyJSON

public class IntermediaryTransactionDTO: ResponseObjectSerializable {
    
    /// A temporary TX, usually returned fully filled.
    public var tx: TransactionDTO?
    
    /// Array of hex-encoded data for you to sign, containing one element for you to sign. Still an array to maintain parity with the Bitcoin API.
    public var tosign: [String]?
    
    /// Array of signatures corresponding to all the data in tosign, typically provided by you. Only one signature is required.
    public var signatures: [String]?
    
    /// Array of public keys corresponding to each signature. In general, these are provided by you, and correspond to the signatures you provide.
    public var pubkeys: [String]?
    
    /// Optional Array of errors in the form “error”:“description-of-error”. This is only returned if there was an error in any stage of transaction generation, and is usually accompanied by a HTTP 400 code.
    public var errors: [String]?
    
    public required init?(json: SwiftyJSON.JSON) {
        self.tx = TransactionDTO(json: json["tx"])
        self.signatures = json["signatures"].array?.filter({ $0.string != nil }).map({ $0.string! })
        self.tosign = json["tosign"].array?.filter({ $0.string != nil }).map({ $0.string! })
        self.pubkeys = json["pubkeys"].array?.filter({ $0.string != nil }).map({ $0.string! })
        self.errors = json["errors"].array?.filter({ $0.string != nil }).map({ $0.string! })
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let tx = self.tx {
            json["tx"] =  tx.toJSON()
        }
        if let signatures = self.signatures {
            json["signatures"] = signatures
        }
        if let tosign = self.tosign {
            json["tosign"] = tosign
        }
        if let pubkeys = self.pubkeys {
            json["pubkeys"] = pubkeys
        }
        if let errors = self.errors {
            json["errors"] = errors
        }
        return json
    }
}
