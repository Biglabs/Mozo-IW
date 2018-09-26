//
//  TxCompletionWireframe.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation

class TxCompletionWireframe : MozoWireframe {
    var txComPresenter: TxCompletionPresenter?
    var txComViewController: TxCompletionViewController?
    
    func presentTransactionCompleteInterface(_ detail: TxDetailDisplayItem) {
        let viewController = viewControllerFromStoryBoard(TxCompletionViewControllerIdentifier) as! TxCompletionViewController
        viewController.eventHandler = txComPresenter
        viewController.detailItem = detail
        txComViewController = viewController
        
        rootWireframe?.displayViewController(viewController)
    }
}
