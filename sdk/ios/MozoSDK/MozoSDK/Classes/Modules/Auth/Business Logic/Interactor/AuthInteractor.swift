//
//  AuthInteractor.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/10/18.
//

import Foundation
import AppAuth

class AuthInteractor : NSObject {
    var output : AuthInteractorOutput?
    
    private var authManager: AuthManager?
    private var anonManager: AnonManager?
    
    init(authManager: AuthManager, anonManager: AnonManager) {
        self.authManager = authManager
        self.anonManager = anonManager
    }
}

extension AuthInteractor : AuthInteractorInput {
    func handleAuthorizationResponse(_ response: OIDAuthorizationResponse?, error: Error?) {
        if let response = response {
            let authState = OIDAuthState(authorizationResponse: response)
            authManager?.setAuthState(authState)
            print("Authorization response with code: \(response.authorizationCode ?? "DEFAULT_CODE")")
            _ = authManager?.codeExchange().done({ (accessToken) in
                self.output?.finishedAuthenticate(accessToken: accessToken)
                AccessTokenManager.saveToken(accessToken)
                self.anonManager?.linkCoinFromAnonymousToCurrentUser()
            })
        } else {
            print("Authorization error: \(error?.localizedDescription ?? "DEFAULT_ERROR")")
        }
    }
    
    func handleRedirectUrl(_ url: URL) -> Bool {
        return authManager?.handleRedirectUrl(url) ?? false
    }
    
    func buildAuthRequest() {
        _ = authManager?.buildAuthRequest().done({ (request) in
            if let rq = request {
                self.output?.finishedBuildAuthRequest(rq)
            }
        })
    }
    
    func setCurrentAuthorizationFlow(_ authorizationFlow : OIDAuthorizationFlowSession?) {
        authManager?.setCurrentAuthorizationFlow(authorizationFlow)
    }
}
