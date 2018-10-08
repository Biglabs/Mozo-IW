//
//  TxCompletionPresenter.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation

class TxCompletionPresenter : NSObject {
    var completionModuleDelegate: TxCompletionModuleDelegate?
    var completionUserInterface : TxCompletionViewInterface?
    var completionInteractor: TxCompletionInteractorInput?
}

extension TxCompletionPresenter : TxCompletionModuleInterface {
    func requestWaitingForTxStatus(hash: String) {
        completionInteractor?.startWaitingStatusService(hash: hash)
    }
    
    func requestStopWaiting() {
        completionInteractor?.stopService()
    }
    
    func requestAddToAddressBook(_ address: String) {
        // Verify address is existing in address book list or not
        let list = SessionStoreManager.addressBookList
        let contain = AddressBookDTO.arrayContainsItem(address, array: list)
        if contain {
            // Show message
            completionUserInterface?.displayError("Address is existing in address book list")
        } else {
            completionModuleDelegate?.requestAddToAddressBook(address)
        }
    }
    
    func requestShowDetail(_ detail: TxDetailDisplayItem) {
        completionModuleDelegate?.requestShowDetail(detail)
    }
}

extension TxCompletionPresenter : TxCompletionInteractorOutput {
    func didReceiveTxStatus(_ status: TransactionStatusType) {
        completionUserInterface?.updateView(status: status)
    }
}
