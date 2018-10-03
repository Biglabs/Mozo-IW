//
//  TxHistoryWireframe.swift
//  MozoSDK
//
//  Created by HoangNguyen on 10/2/18.
//

import Foundation

class TxHistoryWireframe : MozoWireframe {
    var txhPresenter : TxHistoryPresenter?
    var txHistoryViewController : TxHistoryViewController?
    
    func presentTxHistoryInterface() {
        let viewController = viewControllerFromStoryBoard(TxHistoryViewControllerIdentifier) as! TxHistoryViewController
        viewController.eventHandler = txhPresenter
        txHistoryViewController = viewController
        
        txhPresenter?.txhUserInterface = viewController
        rootWireframe?.showRootViewController(viewController, inWindow: (UIApplication.shared.delegate?.window!)!)
    }
}
