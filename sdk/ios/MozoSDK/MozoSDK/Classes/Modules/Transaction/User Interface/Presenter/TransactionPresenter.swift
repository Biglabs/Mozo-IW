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
    var transactionModuleDelegate: TransactionModuleDelegate?
}

extension TransactionPresenter: TransactionModuleInterface {
    func validateTransferTransaction(tokenInfo: TokenInfoDTO?, toAdress: String?, amount: String?) {
        txInteractor?.validateTransferTransaction(tokenInfo: tokenInfo, toAdress: toAdress, amount: amount)
    }
    
    func updateUserInterfaceWithAddress(_ address: String) {
        transferUserInterface?.updateUserInterfaceWithAddress(address)
    }
    
    func showScanQRCodeInterface() {
        txWireframe?.presentScannerQRCodeInterface()
    }
    
    func goBack() {
        
    }
    
    func loadTokenInfo() {
        txInteractor?.loadTokenInfo()
    }
}

extension TransactionPresenter : TransactionInteractorOutput {
    func didReceiveError(_ error: String?) {
        transferUserInterface?.removeSpinner()
        transferUserInterface?.displayError(error!)
    }
    
    func didLoadTokenInfo(_ tokenInfo: TokenInfoDTO) {
        transferUserInterface?.updateUserInterfaceWithTokenInfo(tokenInfo)
    }
    
    func didValidateTransferTransaction(_ error: String?) {
        if let error = error {
            transferUserInterface?.displayError(error)
        } else {
            transferUserInterface?.displaySpinner()
        }
    }
    
    func requestPinTosignTransaction() {
        txWireframe?.presentPINInterface()
    }
}

extension TransactionPresenter : PinModuleDelegate {
    func verifiedPINSuccess(_ pin: String) {
        print("Did receive PIN: \(pin)")
        txInteractor?.performTransfer(pin: pin)
    }
}
