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
    var sdkDelegate: AuthenticationDelegate?
}

extension CorePresenter : CoreModuleInterface {
    func requestForAuthentication() {
        coreInteractor?.checkForAuthentication()
    }
    
    func requestForLogout() {
        coreInteractor?.logout()
        sdkDelegate?.mozoLogoutDidFinish()
    }
    
    func requestForCloseAllMozoUIs() {
        coreWireframe?.requestForCloseAllMozoUIs()
        sdkDelegate?.mozoUIDidCloseAll()
    }
}

extension CorePresenter : AuthModuleDelegate {
    func authModuleDidFinishAuthentication(accessToken: String?) {
        coreInteractor?.handleAferAuth(accessToken: accessToken)
    }
    
    func authModuleDidFinishLogout() {
        // Maybe: Close all existing Mozo's UIs
        // Send delegate back to the app
        sdkDelegate?.mozoLogoutDidFinish()
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
