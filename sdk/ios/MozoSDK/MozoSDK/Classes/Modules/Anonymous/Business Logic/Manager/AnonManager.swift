//
//  AnonManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/11/18.
//

import Foundation

class AnonManager : NSObject {
    var apiManager : ApiManager? {
        didSet {
            handleAnonymousAuthenticate()
        }
    }
    
    private func handleAnonymousAuthenticate() {
        if AccessTokenManager.loadToken() == nil {
            var isNew = false
            var UUID = SessionStoreManager.loadAnonymousUUID()
            if UUID == nil {
                isNew = true
                UUID = NSUUID().uuidString
            }
            let anonymousUser = AnonymousUserDTO(uuid: UUID)
            _ = apiManager?.anonymousAuthenticate(anonymousUser: anonymousUser).done { (anonUser) in
                let anonToken = anonUser?.token
                AccessTokenManager.saveAnonymousToken(anonToken)
                if isNew {
                    SessionStoreManager.saveAnonymousUUID(UUID)
                }
            }
        }
    }
    
    func linkCoinFromAnonymousToCurrentUser() {
        guard let UUID = SessionStoreManager.loadAnonymousUUID() else {
            return
        }
        guard let user = SessionStoreManager.loadCurrentUser() else {
            return
        }
        guard let userId = user.id else {
            return
        }
        _ = apiManager?.linkAnonymousUser(UUID: UUID, userId: userId)
    }
}
