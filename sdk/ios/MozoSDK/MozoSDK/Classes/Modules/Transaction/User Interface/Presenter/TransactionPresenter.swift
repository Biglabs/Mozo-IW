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
}

extension TransactionPresenter: TransactionModuleInterface {
    func performTransfer() {
        
    }
    
    func showScanQRCodeInterface() {
        txWireframe?.presentScannerQRCodeInterface()
    }
    
    func goBack() {
        
    }
}

extension TransactionPresenter : TransactionInteractorOutput {
}
