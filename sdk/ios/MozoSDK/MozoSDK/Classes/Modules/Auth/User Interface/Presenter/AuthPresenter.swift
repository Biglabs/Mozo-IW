//
//  AuthPresenter.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/10/18.
//

import Foundation
import AppAuth

class AuthPresenter : NSObject {
    var authInteractor : AuthInteractor?
    var authWireframe : AuthWireframe?
}

extension AuthPresenter : AuthModuleInterface {
    func performAuthentication() {
        authInteractor?.performAuthentication()
    }
    
    func shouldHandleRedirectUrl() -> Bool {
        return true
    }
    
    func handleRedirectUrl(_ url: URL) {
        
    }
}

extension AuthPresenter : AuthInteractorOutput {
    func presentAuthInterface(request: OIDAuthorizationRequest) {
        let viewController = MozoBasicViewController()
        let currentAuthorizationFlow = OIDAuthorizationService.present(request, presenting: viewController) { (response, error) in
            self.authInteractor?.handleAuthorizationResponse(response, error: error)
        }
        authInteractor?.setCurrentAuthorizationFlow(currentAuthorizationFlow)
    }
    
    func dismissAuthInterface() {
        authWireframe?.dismissAuthInterface()
    }
}
