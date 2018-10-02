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
    var abWireframe: AddressBookWireframe?
    var abDetailWireframe: ABDetailWireframe?
    var corePresenter: CorePresenter?
    
    // MARK: Request
    func requestForAuthentication() {
        presentWaitingInterface()
        corePresenter?.requestForAuthentication(module: Module.Wallet)
    }
    
    func requestForLogout() {
        authWireframe?.presentLogoutInterface()
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
    
    // MARK: Communication with others wireframe
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
    
    func presentTransactionCompleteInterface(_ detail: TxDetailDisplayItem) {
        txCompleteWireframe?.presentTransactionCompleteInterface(detail)
    }
    
    func presentTransactionDetailInterface(_ detail: TxDetailDisplayItem) {
        txDetailWireframe?.presentTransactionDetailInterface(detail)
    }
    
    func presentAddressBookDetailInterface(address: String) {
        abDetailWireframe?.presentAddressBookDetailInterfaceWithAddress(address: address)
    }
    
    func dismissAddressBookDetailInterface() {
        abDetailWireframe?.dismissAddressBookDetailInterface()
    }
    
    func presentAddressBookInterfaceForTransaction() {
        abWireframe?.presentAddressBookInterface()
    }
    
    func updateAddressBookInterfaceForTransaction(displayItem: AddressBookDisplayItem) {
        txWireframe?.updateInterfaceWithDisplayItem(displayItem)
    }
    
    func dismissAddressBookInterface() {
        abWireframe?.dismissAddressBookInterface()
    }
}
