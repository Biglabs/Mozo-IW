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
    
    init(authManager: AuthManager) {
        self.authManager = authManager
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
            })
        } else {
            print("Authorization error: \(error?.localizedDescription ?? "DEFAULT_ERROR")")
            output?.cancelledAuthenticateByUser()
        }
    }
    
    func clearAllAuthSession() {
        authManager?.clearAll()
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
    
    func buildLogoutRequest() {
        _ = authManager?.buildLogoutRequest().done({ (request) in
            if let rq = request {
                self.output?.finishBuildLogoutRequest(rq)
            }
        })
    }
    
    func handleLogoutState() {

    }
}
