//
//  TxDetailWireframe.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation

class TxDetailWireframe : MozoWireframe {
    var txDetailViewController: TxDetailViewController?
    
    func presentTransactionDetailInterface(_ detail: TxDetailDisplayItem) {
        let viewController = viewControllerFromStoryBoard(TxDetailViewControllerIdentifier) as! TxDetailViewController
        viewController.displayItem = detail
        txDetailViewController = viewController
        
        rootWireframe?.displayViewController(viewController)
    }
}
