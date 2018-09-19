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
    
    func presentTransferInterface() {
        let viewController = TransferViewControllerFromStoryboard()
        viewController.eventHandler = txPresenter
        transferViewController = viewController
        
        txPresenter?.transferUserInterface = viewController
        rootWireframe?.replaceTopViewController(viewController)
    }
    
    func presentScannerQRCodeInterface() {
        let viewController = ScannerViewController()
        viewController.eventHandler = txPresenter
        scannerViewController = viewController
        rootWireframe?.presentViewController(viewController)
    }
    
    func TransferViewControllerFromStoryboard() -> TransferViewController {
        let storyboard = StoryboardManager.mozoStoryboard()
        let viewController = storyboard.instantiateViewController(withIdentifier: TransferViewControllerIdentifier) as! TransferViewController
        return viewController
    }
}
