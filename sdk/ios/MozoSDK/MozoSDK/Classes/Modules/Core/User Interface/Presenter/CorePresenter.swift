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
    var coreInteractorService : CoreInteractorService?
    weak var authDelegate: AuthenticationDelegate?
}

extension CorePresenter : CoreModuleInterface {
    func requestForAuthentication(module: Module) {
        coreInteractor?.checkForAuthentication(module: module)
    }
    
    func requestForLogout() {
        coreInteractor?.logout()
        // Send delegate back to the app
        authDelegate?.mozoLogoutDidFinish()
        // Notify for all observing objects
        coreInteractor?.notifyLogoutForAllObservers()
    }
    
    func requestForCloseAllMozoUIs() {
        coreWireframe?.requestForCloseAllMozoUIs(completion: {
            self.authDelegate?.mozoUIDidCloseAll()
        })
    }
}

extension CorePresenter : AuthModuleDelegate {
    func authModuleDidFinishAuthentication(accessToken: String?) {
        coreInteractor?.handleAferAuth(accessToken: accessToken)
    }
}

extension CorePresenter: WalletModuleDelegate {
    func walletModuleDidFinish() {
        // Close all existing Mozo's UIs
        coreWireframe?.requestForCloseAllMozoUIs(completion: {
            // Send delegate back to the app
            self.authDelegate?.mozoAuthenticationDidFinish()
            // Notify for all observing objects
            self.coreInteractor?.notifyAuthSuccessForAllObservers()
        })
    }
}

extension CorePresenter : CoreInteractorOutput {
    func finishedCheckAuthentication(keepGoing: Bool, module: Module) {
        if keepGoing {
            coreWireframe?.authenticate()
        } else {
            // Should continue with any module
            switch module {
                case.Transaction:
                    coreWireframe?.prepareForTransferInterface()
                default: coreWireframe?.prepareForWalletInterface()
            }
        }
    }
    
    func finishedHandleAferAuth() {
        coreWireframe?.prepareForWalletInterface()
    }
}

extension CorePresenter: TransactionModuleDelegate {
    func requestPINInterfaceForTransaction() {
        coreWireframe?.presentPINInterfaceForTransaction()
    }
    
    func removePINDelegate() {
        coreWireframe?.walletWireframe?.walletPresenter?.pinModuleDelegate = nil
    }
    
    func didSendTxSuccess(_ tx: IntermediaryTransactionDTO, tokenInfo: TokenInfoDTO) {
        // Build transaction detail item
        let detailItem = TxDetailDisplayItem(transaction: tx, tokenInfo: tokenInfo  )
        // Display transaction completion interface
        coreWireframe?.presentTransactionCompleteInterface(detailItem)
    }
}

extension CorePresenter: TxCompletionModuleDelegate {
    func requestAddToAddressBook(_ address: String) {
        
    }
    
    func requestShowDetail(_ detail: TxDetailDisplayItem) {
        coreWireframe?.presentTransactionDetailInterface(detail)
    }
}
