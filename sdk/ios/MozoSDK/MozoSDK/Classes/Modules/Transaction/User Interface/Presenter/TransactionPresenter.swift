//
//  TransactionPresenter.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/18/18.
//

import Foundation

class TransactionPresenter : NSObject {
    var txWireframe : TransactionWireframe?
    var txInteractor: TransactionInteractorInput?
    var transferUserInterface : TransferViewInterface?
    var confirmUserInterface : ConfirmTransferViewInterface?
    var transactionModuleDelegate: TransactionModuleDelegate?
    
    func updateInterfaceWithDisplayItem(_ displayItem: AddressBookDisplayItem) {
        transferUserInterface?.updateInterfaceWithDisplayItem(displayItem)
    }
}

extension TransactionPresenter: TransactionModuleInterface {
    func showAddressBookInterface() {
        transactionModuleDelegate?.requestAddressBookInterfaceForTransaction()
    }
    
    func sendConfirmTransaction(_ transaction: TransactionDTO) {
        confirmUserInterface?.displaySpinner()
        txInteractor?.sendUserConfirmTransaction(transaction)
    }
    
    func validateTransferTransaction(tokenInfo: TokenInfoDTO?, toAdress: String?, amount: String?, displayName: String?) {
        txInteractor?.validateTransferTransaction(tokenInfo: tokenInfo, toAdress: toAdress, amount: amount, displayName: displayName)
    }
    
    func updateUserInterfaceWithAddress(_ address: String) {
        transferUserInterface?.updateUserInterfaceWithAddress(address)
    }
    
    func showScanQRCodeInterface() {
        txWireframe?.presentScannerQRCodeInterface()
    }
    
    func loadTokenInfo() {
        txInteractor?.loadTokenInfo()
    }
}

extension TransactionPresenter : TransactionInteractorOutput {
    func continueWithTransaction(_ transaction: TransactionDTO, tokenInfo: TokenInfoDTO, displayName: String?) {
        transferUserInterface?.hideErrorValidation()
        txWireframe?.presentConfirmInterface(transaction: transaction, tokenInfo: tokenInfo, displayName: displayName)
    }
    
    func didReceiveError(_ error: String?) {
        confirmUserInterface?.removeSpinner()
        confirmUserInterface?.displayError(error!)
    }
    
    func didLoadTokenInfo(_ tokenInfo: TokenInfoDTO) {
        transferUserInterface?.updateUserInterfaceWithTokenInfo(tokenInfo)
    }
    
    func didValidateTransferTransaction(_ error: String?, isAddress: Bool) {
        transferUserInterface?.showErrorValidation(error, isAddress: isAddress)
    }
    
    func requestPinToSignTransaction() {
        transactionModuleDelegate?.requestPINInterfaceForTransaction()
    }
    
    func didSendTransactionSuccess(_ transaction: IntermediaryTransactionDTO, tokenInfo: TokenInfoDTO) {
        transactionModuleDelegate?.didSendTxSuccess(transaction, tokenInfo: tokenInfo)
    }
}

extension TransactionPresenter : PinModuleDelegate {
    func verifiedPINSuccess(_ pin: String) {
        print("Did receive PIN: \(pin)")
        transactionModuleDelegate?.removePINDelegate()
        txInteractor?.performTransfer(pin: pin)
    }
}
