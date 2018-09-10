//
//  AuthInteractorIO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/10/18.
//

import Foundation
import AppAuth

protocol AuthInteractorInput {
    func performAuthentication()
    func setCurrentAuthorizationFlow(_ authorizationFlow : OIDAuthorizationFlowSession?)
    func handleAuthorizationResponse(_ response: OIDAuthorizationResponse?, error: Error?)
    func handleRedirectUrl(_ url: URL)
}

protocol AuthInteractorOutput {
    func presentAuthInterface(request: OIDAuthorizationRequest)
    func dismissAuthInterface()
}
