//
//  CoreInteractor.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/6/18.
//

import Foundation
import PromiseKit

class CoreInteractor: NSObject {
    var output: CoreInteractorOutput?
    
    let anonManager: AnonManager
    let apiManager: ApiManager
    let userDataManager: UserDataManager
    
    init(anonManager: AnonManager, apiManager : ApiManager, userDataManager: UserDataManager) {
        self.anonManager = anonManager
        self.apiManager = apiManager
        self.userDataManager = userDataManager
    }
    
    private func getUserProfile() -> Promise<Void> {
        return Promise { seal in
            _ = apiManager.getUserProfile().done { (userProfile) in
                let user = UserDTO(id: userProfile.userId, profile: userProfile)
                SessionStoreManager.saveCurrentUser(user: user)
                
                let userModel = UserModel(id: userProfile.userId, mnemonic: nil, pin: nil, wallets: nil)
                if self.userDataManager.addNewUser(userModel) == true {
                    seal.resolve(nil)
                }
            }
        }
    }
}

extension CoreInteractor: CoreInteractorInput {
    func checkForAuthentication() {
        if AccessTokenManager.getAccessToken() != nil {
            if SessionStoreManager.loadCurrentUser() != nil {
                output?.finishedCheckAuthentication(keepGoing: false)
            } else {
                print("😎 Load user info.")
                _ = getUserProfile().done({ () in
                    self.output?.finishedCheckAuthentication(keepGoing: false)
                })
            }
        } else {
            output?.finishedCheckAuthentication(keepGoing: true)
        }
    }
    
    func handleAferAuth(accessToken: String?) {
        AccessTokenManager.saveToken(accessToken)
        anonManager.linkCoinFromAnonymousToCurrentUser()
        _ = getUserProfile().done({ () in
            self.output?.finishedHandleAferAuth()
        })
    }
    
    func logout() {
        // Maybe: Call logout API to revoke token
        SessionStoreManager.clearCurrentUser()
        AccessTokenManager.clearToken()
    }
}
