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
    weak var authDelegate: AuthenticationDelegate?
}

extension CorePresenter : CoreModuleInterface {
    func requestForAuthentication(module: Module) {
        coreInteractor?.checkForAuthentication(module: module)
    }
    
    func requestForLogout() {
        coreInteractor?.logout()
        authDelegate?.mozoLogoutDidFinish()
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
    
    func authModuleDidFinishLogout() {
        // Maybe: Close all existing Mozo's UIs
        // Send delegate back to the app
        authDelegate?.mozoLogoutDidFinish()
    }
}

extension CorePresenter: WalletModuleDelegate {
    func walletModuleDidFinish() {
        // Close all existing Mozo's UIs
        coreWireframe?.requestForCloseAllMozoUIs(completion: {
            // Send delegate back to the app
            self.authDelegate?.mozoAuthenticationDidFinish()
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
        // Display transaction completion interface
        coreWireframe?.presentTransactionCompleteInterface(tx, tokenInfo: tokenInfo)
    }
}

extension CorePresenter: TxCompletionModuleDelegate {
    func requestAddToAddressBook(_ address: String) {
        
    }
    
    func requestShowDetail(_ tx: IntermediaryTransactionDTO, tokenInfo: TokenInfoDTO) {
        coreWireframe?.presentTransactionDetailInterface(tx, tokenInfo: tokenInfo)
    }
}
