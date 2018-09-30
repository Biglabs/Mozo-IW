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
    
    func presentAddInterfaceFromViewController(_ viewController: UIViewController) {
        let viewController = viewControllerFromStoryBoard(ABDetailViewControllerIdentifier) as! ABDetailViewController
        viewController.eventHandler = detailPresenter
//        viewController.modalPresentationStyle = .custom
//        viewController.transitioningDelegate = self
        detailViewController = viewController
        rootWireframe?.displayViewController(viewController)
    }
    
    func dismissDetailInterface() {
//        presentedViewController?.dismiss(animated: true, completion: nil)
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
