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
    
    func presentTransactionCompleteInterface(_ transaction: IntermediaryTransactionDTO, tokenInfo: TokenInfoDTO) {
        let viewController = viewControllerFromStoryBoard(TxCompletionViewControllerIdentifier) as! TxCompletionViewController
        viewController.eventHandler = txComPresenter
        viewController.transaction = transaction
        viewController.tokenInfo = tokenInfo
        txComViewController = viewController
        
        rootWireframe?.displayViewController(viewController)
    }
}
