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
    var callBackModule: Module?
}

extension CorePresenter : CoreModuleInterface {
    func requestForAuthentication(module: Module) {
        coreInteractor?.checkForAuthentication(module: module)
    }
    
    func requestForLogout() {
        
    }
    
    func requestForCloseAllMozoUIs() {
        coreWireframe?.requestForCloseAllMozoUIs(completion: {
            self.authDelegate?.mozoUIDidCloseAll()
        })
    }
    
    func requestCloseToLastMozoUIs() {
        coreWireframe?.requestCloseToLastMozoUIs()
    }
    
    func presentModuleInterface(_ module: Module) {
        // Should continue with any module
        switch module {
        case .Transaction:
            coreWireframe?.prepareForTransferInterface()
        case .TxHistory:
            coreWireframe?.prepareForTxHistoryInterface()
        default: coreWireframe?.prepareForWalletInterface()
        }
    }
}

extension CorePresenter : AuthModuleDelegate {
    func authModuleDidFinishAuthentication(accessToken: String?) {
        coreInteractor?.handleAferAuth(accessToken: accessToken)
    }
    
    func authModuleDidCancelAuthentication() {
        requestForCloseAllMozoUIs()
    }
    
    func authModuleDidFinishLogout() {
        // Send delegate back to the app
        authDelegate?.mozoLogoutDidFinish()
        // Notify for all observing objects
        coreInteractor?.notifyLogoutForAllObservers()
        requestForCloseAllMozoUIs()
    }
    
    func authModuleDidCancelLogout() {
        
    }
}

extension CorePresenter: WalletModuleDelegate {
    func walletModuleDidFinish() {
        if callBackModule != nil {
            // Present call back module interface
            requestCloseToLastMozoUIs()
            presentModuleInterface(callBackModule!)
            callBackModule = nil
        } else {
            // Close all existing Mozo's UIs
            coreWireframe?.requestForCloseAllMozoUIs(completion: {
                // Send delegate back to the app
                self.authDelegate?.mozoAuthenticationDidFinish()
            })
        }
        // Notify for all observing objects
        self.coreInteractor?.notifyAuthSuccessForAllObservers()
    }
}

extension CorePresenter : CoreInteractorOutput {
    func continueWithWallet(_ callbackModule: Module) {
        // Should display call back module (if any)
        self.callBackModule = callbackModule
        presentModuleInterface(.Wallet)
    }
    
    func finishedCheckAuthentication(keepGoing: Bool, module: Module) {
        if keepGoing {
            // Should display call back module (if any)
            if module != .Wallet {
                self.callBackModule = module
            }
            coreWireframe?.authenticate()
        } else {
            presentModuleInterface(module)
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
        let data = TxDetailDisplayData(transaction: tx, tokenInfo: tokenInfo)
        let detailItem = data.collectDisplayItem()
        // Display transaction completion interface
        coreWireframe?.presentTransactionCompleteInterface(detailItem)
    }
    
    func requestAddressBookInterfaceForTransaction() {
        coreWireframe?.presentAddressBookInterfaceForTransaction()
    }
}

extension CorePresenter: TxCompletionModuleDelegate {
    func requestAddToAddressBook(_ address: String) {
        // Verify address is existing in address book list or not
        let list = SessionStoreManager.addressBookList
        let contain = AddressBookDTO.arrayContainsItem(address, array: list)
        if contain {
            // TODO: Show message address is existing in address book list
        } else {
            coreWireframe?.presentAddressBookDetailInterface(address: address)
        }
    }
    
    func requestShowDetail(_ detail: TxDetailDisplayItem) {
        coreWireframe?.presentTransactionDetailInterface(detail)
    }
}

extension CorePresenter: AddressBookModuleDelegate {
    func addressBookModuleDidChooseItemOnUI(addressBook: AddressBookDisplayItem) {
        coreWireframe?.updateAddressBookInterfaceForTransaction(displayItem: addressBook)
        coreWireframe?.dismissAddressBookInterface()
    }
}

extension CorePresenter: ABDetailModuleDelegate {
    func detailModuleDidCancelSaveAction() {
        
    }
    
    func detailModuleDidSaveAddressBook() {
        coreWireframe?.dismissAddressBookDetailInterface()
    }
}

extension CorePresenter: TxHistoryModuleDelegate {
    func txHistoryModuleDidChooseItemOnUI(txHistory: TxHistoryDisplayItem, tokenInfo: TokenInfoDTO) {
        let data = TxDetailDisplayData(txHistory: txHistory, tokenInfo: tokenInfo)
        let detailItem = data.collectDisplayItem()
        // Display transaction completion interface
        coreWireframe?.presentTransactionDetailInterface(detailItem)
    }
}
