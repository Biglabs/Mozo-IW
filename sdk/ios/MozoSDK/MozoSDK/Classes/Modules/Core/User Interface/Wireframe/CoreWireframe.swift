//
//  CoreWireframe.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/12/18.
//

import Foundation

class CoreWireframe : MozoWireframe {
    var authWireframe: AuthWireframe?
    var walletWireframe: WalletWireframe?
    var txWireframe: TransactionWireframe?
    var corePresenter: CorePresenter?
    
    func requestForAuthentication() {
        presentWaitingInterface()
        corePresenter?.requestForAuthentication()
    }
    
    func requestForLogout() {
        corePresenter?.requestForLogout()
    }
    
    func requestForTransfer() {
//        presentWaitingInterface()
        txWireframe?.presentTransferInterface()
    }
    
    func requestForCloseAllMozoUIs() {
        rootWireframe?.closeAllMozoUIs()
    }
    
    func authenticate() {
        authWireframe?.presentInitialAuthInterface()
    }
    
    func prepareForWalletInterface() {
        walletWireframe?.presentInitialWalletInterface()
    }
}
