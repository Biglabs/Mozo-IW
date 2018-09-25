//
//  TxDetailWireframe.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation

class TxDetailWireframe : MozoWireframe {
    var txDetailViewController: TxDetailViewController?
    
    func presentTransactionDetailInterface(_ transaction: IntermediaryTransactionDTO, tokenInfo: TokenInfoDTO) {
        let viewController = viewControllerFromStoryBoard(TxDetailViewControllerIdentifier) as! TxDetailViewController
        viewController.transaction = transaction
        viewController.tokenInfo = tokenInfo
        txDetailViewController = viewController
        
        rootWireframe?.displayViewController(viewController)
    }
}
