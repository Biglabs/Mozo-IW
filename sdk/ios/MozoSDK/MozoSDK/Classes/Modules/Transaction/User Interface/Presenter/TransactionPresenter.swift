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
}

extension TransactionPresenter: TransactionModuleInterface {
    func sendConfirmTransaction(_ transaction: TransactionDTO) {
        confirmUserInterface?.displaySpinner()
        txInteractor?.sendUserConfirmTransaction(transaction)
    }
    
    func validateTransferTransaction(tokenInfo: TokenInfoDTO?, toAdress: String?, amount: String?) {
        txInteractor?.validateTransferTransaction(tokenInfo: tokenInfo, toAdress: toAdress, amount: amount)
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
    func continueWithTransaction(_ transaction: TransactionDTO, tokenInfo: TokenInfoDTO) {
        txWireframe?.presentConfirmInterface(transaction: transaction, tokenInfo: tokenInfo)
    }
    
    func didReceiveError(_ error: String?) {
        confirmUserInterface?.removeSpinner()
        confirmUserInterface?.displayError(error!)
    }
    
    func didLoadTokenInfo(_ tokenInfo: TokenInfoDTO) {
        transferUserInterface?.updateUserInterfaceWithTokenInfo(tokenInfo)
    }
    
    func didValidateTransferTransaction(_ error: String?) {
        if let error = error {
            transferUserInterface?.displayError(error)
        }
    }
    
    func requestPinToSignTransaction() {
        transactionModuleDelegate?.requestPINInterfaceForTransaction()
    }
    
    func didSendTransactionSuccess(_ transaction: IntermediaryTransactionDTO) {
        transactionModuleDelegate?.didSendTxSuccess(transaction)
    }
}

extension TransactionPresenter : PinModuleDelegate {
    func verifiedPINSuccess(_ pin: String) {
        print("Did receive PIN: \(pin)")
        transactionModuleDelegate?.removePINDelegate()
        txInteractor?.performTransfer(pin: pin)
    }
}
