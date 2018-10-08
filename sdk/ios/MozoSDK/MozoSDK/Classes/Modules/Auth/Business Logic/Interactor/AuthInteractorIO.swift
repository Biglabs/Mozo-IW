//
//  AuthInteractorIO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/10/18.
//

import Foundation
import AppAuth

protocol AuthInteractorInput {
    func buildAuthRequest()
    func setCurrentAuthorizationFlow(_ authorizationFlow : OIDAuthorizationFlowSession?)
    func handleAuthorizationResponse(_ response: OIDAuthorizationResponse?, error: Error?)
    
    func buildLogoutRequest()
    func handleLogoutState()
    func clearAllAuthSession()
}

protocol AuthInteractorOutput {
    func finishedBuildAuthRequest(_ request: OIDAuthorizationRequest)
    func finishedAuthenticate(accessToken: String?)
    func cancelledAuthenticateByUser()
    
    func finishBuildLogoutRequest(_ request: OIDAuthorizationRequest)
    func finishLogout()
}
