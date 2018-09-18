//
//  CorePresenter.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/13/18.
//

import Foundation

class CorePresenter : NSObject {
    var coreWireframe : CoreWireframe?
    var coreInteractor : CoreInteractorInput?
    var authDelegate: AuthenticationDelegate?
}

extension CorePresenter : CoreModuleInterface {
    func requestForAuthentication() {
        coreInteractor?.checkForAuthentication()
    }
    
    func requestForLogout() {
        coreInteractor?.logout()
        authDelegate?.mozoLogoutDidFinish()
    }
    
    func requestForCloseAllMozoUIs() {
        coreWireframe?.requestForCloseAllMozoUIs()
        authDelegate?.mozoUIDidCloseAll()
    }
}

extension CorePresenter : AuthModuleDelegate {
    func authModuleDidFinishAuthentication(accessToken: String?) {
        coreInteractor?.handleAferAuth(accessToken: accessToken)
    }
    
    func authModuleDidFinishLogout() {
        // Maybe: Close all existing Mozo's UIs
        // Send delegate back to the app
        authDelegate?.mozoLogoutDidFinish()
    }
}

extension CorePresenter: WalletModuleDelegate {
    func walletModuleDidFinish() {
        // Close all existing Mozo's UIs
        coreWireframe?.requestForCloseAllMozoUIs()
        // Send delegate back to the app
        authDelegate?.mozoAuthenticationDidFinish()
    }
}

extension CorePresenter : CoreInteractorOutput {
    func finishedCheckAuthentication(keepGoing: Bool) {
        if keepGoing {
            coreWireframe?.authenticate()
        } else {
            coreWireframe?.prepareForWalletInterface()
        }
    }
    
    func finishedHandleAferAuth() {
        coreWireframe?.prepareForWalletInterface()
    }
}
