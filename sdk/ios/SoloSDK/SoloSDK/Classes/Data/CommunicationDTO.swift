//
//  CommunicationDTO.swift
//  SOLOWallet-ios
//
//  Created by Hoang Nguyen on 6/25/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import SwiftyJSON
public class CommunicationDTO: ResponseObjectSerializable {
    
    public var action: String?
    public var receiver: String?
    public var params: IntermediaryTransactionDTO?
    public var coinType: String?
    public var result: ResultDTO?
    public var network: String?
    
    public required init?(action: String?, receiver: String?, params: IntermediaryTransactionDTO?, coinType: String?, network: String?) {
        self.action = action
        self.receiver = receiver
        self.params = params
        self.coinType = coinType
        self.network = network
    }
    
    public required init?(json: SwiftyJSON.JSON) {
        self.action = json["action"].string
        self.receiver = json["receiver"].string
        self.params = IntermediaryTransactionDTO(json: json["params"])
        self.coinType = json["coinType"].string
        self.result = ResultDTO(json: json["result"])
        self.network = json["network"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let action = self.action {
            json["action"] = action
        }
        if let receiver = self.receiver {
            json["receiver"] = receiver
        }
        if let params = self.params {
            json["params"] = params.toJSON()
        }
        if let coinType = self.coinType {
            json["coinType"] = coinType
        }
        if let network = self.network {
            json["network"] = network
        }
        return json
    }
    
    func rawString() -> String {
        let json = JSON(self.toJSON())
        return json.rawString()!
    }
}

public class ResultDTO: ResponseObjectSerializable {
    public var success: Bool?
    public var error: ErrorDTO?
    public var walletId: String?
    public var signedTransaction: String?
    
    public required init?(json: SwiftyJSON.JSON) {
        self.success = json["success"].bool
        self.error = ErrorDTO(json: json["error"])
        self.walletId = json["walletId"].string
        self.signedTransaction = json["signedTransaction"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let error = self.error {
            json["error"] = error.toJSON()
        }
        if let walletId = self.walletId {
            json["walletId"] = walletId
        }
        if let signedTransaction = self.signedTransaction {
            json["signedTransaction"] = signedTransaction
        }
        return json
    }
}

public class ErrorDTO: LocalizedError, ResponseObjectSerializable {
    public var code: String?
    public var title: String?
    public var detail: String?
    public var type: String?
    
    public required init?(json: SwiftyJSON.JSON) {
        self.code = json["code"].string
        self.title = json["title"].string
        self.detail = json["detail"].string
        self.type = json["type"].string
    }
    
    public required init?(){}
    
    public func toJSON() -> Dictionary<String, Any> {
        var json = Dictionary<String, Any>()
        if let code = self.code {
            json["code"] = code
        }
        if let title = self.title {
            json["title"] = title
        }
        if let detail = self.detail {
            json["detail"] = detail
        }
        if let type = self.type {
            json["type"] = type
        }
        return json
    }
}
