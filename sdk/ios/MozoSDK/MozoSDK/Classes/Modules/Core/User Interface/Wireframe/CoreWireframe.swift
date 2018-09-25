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
    var txCompleteWireframe: TxCompletionWireframe?
    var txDetailWireframe: TxDetailWireframe?
    var corePresenter: CorePresenter?
    
    func requestForAuthentication() {
        presentWaitingInterface()
        corePresenter?.requestForAuthentication(module: Module.Wallet)
    }
    
    func requestForLogout() {
        corePresenter?.requestForLogout()
    }
    
    func requestForTransfer() {
        presentWaitingInterface()
        corePresenter?.requestForAuthentication(module: Module.Transaction)
    }
    
    func requestForCloseAllMozoUIs(completion: (() -> Swift.Void)? = nil) {
        rootWireframe?.closeAllMozoUIs(completion: {
            completion!()
        })
    }
    
    func authenticate() {
        authWireframe?.presentInitialAuthInterface()
    }
    
    func prepareForTransferInterface() {
        txWireframe?.presentTransferInterface()
    }
    
    func prepareForWalletInterface() {
        walletWireframe?.presentInitialWalletInterface()
    }
    
    func presentPINInterfaceForTransaction() {
        walletWireframe?.walletPresenter?.pinModuleDelegate = txWireframe?.txPresenter
        presentPINInterface()
    }
    
    func presentPINInterface() {
        walletWireframe?.presentPINInterface(passPharse: nil)
    }
    
    func presentTransactionCompleteInterface(_ transaction: IntermediaryTransactionDTO, tokenInfo: TokenInfoDTO) {
        txCompleteWireframe?.presentTransactionCompleteInterface(transaction, tokenInfo: tokenInfo)
    }
    
    func presentTransactionDetailInterface(_ transaction: IntermediaryTransactionDTO, tokenInfo: TokenInfoDTO) {
        txDetailWireframe?.presentTransactionDetailInterface(transaction, tokenInfo: tokenInfo)
    }
}
