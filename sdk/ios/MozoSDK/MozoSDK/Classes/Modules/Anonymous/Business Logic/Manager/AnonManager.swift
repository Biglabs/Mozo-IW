//
//  AnonManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/11/18.
//

import Foundation

class AnonManager : NSObject {
    var apiManager : ApiManager {
        didSet {
            handleAnonymousAuthenticate()
        }
    }
    
    init(apiManager: ApiManager) {
        self.apiManager = apiManager
    }
    
    private func handleAnonymousAuthenticate() {
        if AccessTokenManager.loadToken() == nil {
            let UUID = NSUUID().uuidString
            _ = apiManager.anonymousAuthenticate(UUID: UUID).done { (result) in
                let anonToken = ""
                AccessTokenManager.saveAnonymousToken(anonToken)
            }
        }
    }
}
