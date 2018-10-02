//
//  ABDetailWireframe.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation

class ABDetailWireframe : MozoWireframe {
    var detailPresenter : ABDetailPresenter?
    var detailViewController : ABDetailViewController?
    
    func presentAddressBookDetailInterfaceWithAddress(address: String) {
        let viewController = viewControllerFromStoryBoard(ABDetailViewControllerIdentifier) as! ABDetailViewController
        viewController.eventHandler = detailPresenter
        viewController.address = address
        viewController.modalPresentationStyle = .custom
        viewController.transitioningDelegate = self
        detailViewController = viewController
        
        detailPresenter?.detailUserInterface = viewController
        rootWireframe?.displayViewController(viewController)
    }
    
    func dismissAddressBookDetailInterface() {
//        detailViewController?.dismiss(animated: true, completion: nil)
        rootWireframe?.dismissTopViewController()
    }
}

extension ABDetailWireframe : UIViewControllerTransitioningDelegate {
    func animationController(forDismissed dismissed: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        return ABDetailDismissalTransition()
    }
    
    func animationController(forPresented presented: UIViewController, presenting: UIViewController, source: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        return ABDetailPresentationTransition()
    }
}
