//
//  AuthInteractor.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/10/18.
//

import Foundation
import AppAuth

class AuthInteractor : NSObject {
    private var output : AuthInteractorOutput?
    
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
            // could just call [self tokenExchange:nil] directly, but will let the user initiate it.
        } else {
            print("Authorization error: \(error?.localizedDescription ?? "DEFAULT_ERROR")")
        }
    }
    
    func handleRedirectUrl(_ url: URL) {
        
    }
    
    func performAuthentication() {
        if let request = authManager?.buildAuthRequest() {
            output?.presentAuthInterface(request: request)
        }
    }
    
    func setCurrentAuthorizationFlow(_ authorizationFlow : OIDAuthorizationFlowSession?) {
        authManager?.setCurrentAuthorizationFlow(authorizationFlow)
    }
}
