//
//  TransactionWireframe.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/18/18.
//

import Foundation
import UIKit

class TransactionWireframe: MozoWireframe {
    var txPresenter : TransactionPresenter?
    var transferViewController : TransferViewController?
    var scannerViewController: ScannerViewController?
    var confirmViewController: ConfirmTransferViewController?
    
    func presentTransferInterface() {
        let viewController = viewControllerFromStoryBoard(TransferViewControllerIdentifier) as! TransferViewController
        viewController.eventHandler = txPresenter
        transferViewController = viewController
        
        txPresenter?.transferUserInterface = viewController
        rootWireframe?.displayViewController(viewController)
    }
    
    func updateInterfaceWithDisplayItem(_ displayItem: AddressBookDisplayItem) {
        txPresenter?.updateInterfaceWithDisplayItem(displayItem)
    }
    
    func presentConfirmInterface(transaction: TransactionDTO, tokenInfo: TokenInfoDTO, displayName: String?) {
        let viewController = viewControllerFromStoryBoard(ConfirmTransferViewControllerIdentifier) as! ConfirmTransferViewController
        viewController.eventHandler = txPresenter
        viewController.transaction = transaction
        viewController.tokenInfo = tokenInfo
        viewController.displayName = displayName
        confirmViewController = viewController
        
        txPresenter?.confirmUserInterface = viewController
        rootWireframe?.displayViewController(viewController)
    }
    
    func presentScannerQRCodeInterface() {
        let viewController = ScannerViewController()
        viewController.eventHandler = txPresenter
        scannerViewController = viewController
        rootWireframe?.presentViewController(viewController)
    }
}
