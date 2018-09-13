//
//  WalletInfoDTO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/13/18.
//

import Foundation

import SwiftyJSON

public class WalletInfoDTO: Codable, ResponseObjectSerializable {
    public var encryptSeedPhrase: String?
    public var offchainAddress: String?
    
    public required init(encryptSeedPhrase: String?, offchainAddress: String?){
        self.encryptSeedPhrase = encryptSeedPhrase
        self.offchainAddress = offchainAddress
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.encryptSeedPhrase = json["encryptSeedPhrase"].string
        self.offchainAddress = json["offchainAddress"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let encryptSeedPhrase = self.encryptSeedPhrase {
            json["encryptSeedPhrase"] = encryptSeedPhrase
        }
        if let offchainAddress = self.offchainAddress {
            json["offchainAddress"] = offchainAddress
        }
        return json
    }
}
