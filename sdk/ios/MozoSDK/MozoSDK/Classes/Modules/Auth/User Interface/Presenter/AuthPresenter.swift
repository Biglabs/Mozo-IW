//
//  AuthPresenter.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/10/18.
//

import Foundation
import AppAuth

class AuthPresenter : NSObject {
    var authInteractor : AuthInteractorInput?
    var authWireframe : AuthWireframe?
    var authModuleDelegate : AuthModuleDelegate?
}

extension AuthPresenter : AuthModuleInterface {
    func performAuthentication() {
        authInteractor?.buildAuthRequest()
    }
}

extension AuthPresenter : AuthInteractorOutput {
    func finishedBuildAuthRequest(_ request: OIDAuthorizationRequest) {
        let viewController = authWireframe?.getTopViewController()
        // performs authentication request
        print("Initiating authorization request with scope: \(request.scope ?? "DEFAULT_SCOPE")")
        let currentAuthorizationFlow = OIDAuthorizationService.present(request, presenting: viewController!) { (response, error) in
            self.authInteractor?.handleAuthorizationResponse(response, error: error)
        }
        authInteractor?.setCurrentAuthorizationFlow(currentAuthorizationFlow)
    }
    
    func finishedAuthenticate(accessToken: String?) {
        authModuleDelegate?.authModuleDidFinishAuthentication(accessToken: accessToken)
    }
    
    func cancelledAuthenticateByUser() {
        authWireframe?.dismissAuthInterface()
    }
}
