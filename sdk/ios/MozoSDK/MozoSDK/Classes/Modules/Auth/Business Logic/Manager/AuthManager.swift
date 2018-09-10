//
//  AuthManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/10/18.
//

import Foundation
import AppAuth

typealias PostRegistrationCallback = (_ configuration: OIDServiceConfiguration?, _ registrationResponse: OIDRegistrationResponse?) -> Void

class AuthManager : NSObject {
    private (set) var currentAuthorizationFlow: OIDAuthorizationFlowSession?
    
    // A property to store the auth state
    private (set) var authState: OIDAuthState?
    
    func setCurrentAuthorizationFlow(_ authorizationFlow: OIDAuthorizationFlowSession?) {
        self.currentAuthorizationFlow = authorizationFlow
    }
    
    func buildAuthRequest() -> OIDAuthorizationRequest? {
        guard let issuer = URL(string: Configuration.AUTH_ISSSUER) else {
            print("😞 Error creating URL for : \(Configuration.AUTH_ISSSUER)")
            return nil
        }
        
        print("Fetching configuration for issuer: \(issuer)")
        
        // discovers endpoints
        OIDAuthorizationService.discoverConfiguration(forIssuer: issuer){ configuration, error in
            guard let config = configuration else {
                print("😞 Error retrieving discovery document: \(error?.localizedDescription ?? "DEFAULT_ERROR")")
                self.authState = nil
                return
            }
            
            print("Got configuration: \(config)")
        
            let clientId = Configuration.AUTH_CLIENT_ID
            self.doClientRegistration(configuration: config) { configuration, response in
                
                guard let configuration = configuration, let clientID = response?.clientID else {
                    print("Error retrieving configuration OR clientID")
                    return
                }
                
                self.doAuthWithAutoCodeExchange(configuration: configuration,
                                                clientID: clientID,
                                                clientSecret: response?.clientSecret)
            }
        }
        
        return nil
    }
}

//MARK: AppAuth Methods
extension AuthManager {
    
    func doClientRegistration(configuration: OIDServiceConfiguration, callback: @escaping PostRegistrationCallback) {
        
        guard let redirectURI = URL(string: Configuration.AUTH_REDIRECT_URL) else {
            print("Error creating URL for : \(Configuration.AUTH_REDIRECT_URL)")
            return
        }
        
        let request: OIDRegistrationRequest = OIDRegistrationRequest(configuration: configuration,
                                                                     redirectURIs: [redirectURI],
                                                                     responseTypes: nil,
                                                                     grantTypes: nil,
                                                                     subjectType: nil,
                                                                     tokenEndpointAuthMethod: "client_secret_post",
                                                                     additionalParameters: nil)
        
        // performs registration request
        print("Initiating registration request")
        
        OIDAuthorizationService.perform(request) { response, error in
            
            if let regResponse = response {
                self.authState = OIDAuthState(registrationResponse: regResponse)
                print("Got registration response: \(regResponse)")
                callback(configuration, regResponse)
            } else {
                print("Registration error: \(error?.localizedDescription ?? "DEFAULT_ERROR")")
                self.authState = nil
            }
        }
    }
    
    func doAuthWithAutoCodeExchange(configuration: OIDServiceConfiguration, clientID: String, clientSecret: String?) {
        
        guard let redirectURI = URL(string: Configuration.AUTH_REDIRECT_URL) else {
            print("Error creating URL for : \(Configuration.AUTH_REDIRECT_URL)")
            return
        }
        
        // builds authentication request
        let request = OIDAuthorizationRequest(configuration: configuration,
                                              clientId: clientID,
                                              clientSecret: clientSecret,
                                              scopes: [OIDScopeOpenID, OIDScopeProfile],
                                              redirectURL: redirectURI,
                                              responseType: OIDResponseTypeCode,
                                              additionalParameters: nil)
        
        // performs authentication request
        print("Initiating authorization request with scope: \(request.scope ?? "DEFAULT_SCOPE")")
    }
    
    func doAuthWithoutCodeExchange(configuration: OIDServiceConfiguration, clientID: String, clientSecret: String?) {
        
        guard let redirectURI = URL(string: Configuration.AUTH_REDIRECT_URL) else {
            print("Error creating URL for : \(Configuration.AUTH_REDIRECT_URL)")
            return
        }
        
        // builds authentication request
        let request = OIDAuthorizationRequest(configuration: configuration,
                                              clientId: clientID,
                                              clientSecret: clientSecret,
                                              scopes: [OIDScopeOpenID, OIDScopeProfile],
                                              redirectURL: redirectURI,
                                              responseType: OIDResponseTypeCode,
                                              additionalParameters: nil)
        
        // performs authentication request
        print("Initiating authorization request with scope: \(request.scope ?? "DEFAULT_SCOPE")")
    }
}

//MARK: Helper Methods
extension AuthManager {
    func saveState() {
        
    }
    
    func loadState() {
        
    }
    
    func setAuthState(_ authState: OIDAuthState?) {
        if (self.authState == authState) {
            return
        }
        self.authState = authState
        self.authState?.stateChangeDelegate = self
        self.stateChanged()
    }
    
    func stateChanged() {
        self.saveState()
    }
}

//MARK: OIDAuthState Delegate
extension AuthManager : OIDAuthStateChangeDelegate, OIDAuthStateErrorDelegate {
    func didChange(_ state: OIDAuthState) {
        print("AuthState did change.")
        self.stateChanged()
    }
    
    func authState(_ state: OIDAuthState, didEncounterAuthorizationError error: Error) {
        print("Received authorization error: \(error)")
    }
}
