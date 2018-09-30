//
//  ABDetailDismissalTransition.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation
import UIKit

class ABDetailDismissalTransition : NSObject, UIViewControllerAnimatedTransitioning {
    func transitionDuration(using transitionContext: UIViewControllerContextTransitioning?) -> TimeInterval {
        return 0.72
    }
    
    func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
        let fromVC = transitionContext.viewController(forKey: UITransitionContextViewControllerKey.from) as! ABDetailViewController
        
        let finalCenter = CGPoint(x: 160.0, y: (fromVC.view.bounds.size.height / 2) - 1000.0)
        
        let options = UIViewAnimationOptions.curveEaseIn
        
        UIView.animate(withDuration: self.transitionDuration(using: transitionContext),
                       delay: 0.0,
                       usingSpringWithDamping: 0.64,
                       initialSpringVelocity: 0.22,
                       options: options,
                       animations: {
                        fromVC.view.center = finalCenter
                        fromVC.transitioningBackgroundView.alpha = 0.0
        },
                       completion: { finished in
                        fromVC.view.removeFromSuperview()
                        transitionContext.completeTransition(true)
        }
        )
    }
    
}
