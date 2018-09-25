//
//  RootWireframe.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit

let PINViewControllerIdentifier = "PINViewController"
let PassPhraseViewControllerIdentifier = "PassPhraseViewController"
let WaitingViewControllerIdentifier = "WaitingViewController"
let TransferViewControllerIdentifier = "TransferViewController"
let ConfirmTransferViewControllerIdentifier = "ConfirmTransferViewController"

class RootWireframe : NSObject {
    let mozoNavigationController = MozoNavigationController()
    
    func showRootViewController(_ viewController: UIViewController, inWindow: UIWindow) {
        mozoNavigationController.viewControllers = [viewController]
        if inWindow.rootViewController != nil {
            let top = getTopViewController()
            top?.present(mozoNavigationController, animated: true, completion: nil)
        } else {
            inWindow.rootViewController = mozoNavigationController
        }
    }
    
    func displayViewController(_ viewController: UIViewController) {
        mozoNavigationController.pushViewController(viewController, animated: false)
    }
    
    func presentViewController(_ viewController: UIViewController) {
        let top = getTopViewController()
        top?.present(viewController, animated: true, completion: nil)
    }
    
    func dismissTopViewController() {
        _ = mozoNavigationController.viewControllers.popLast()
    }
    
    public func getTopViewController() -> UIViewController! {
        let appDelegate = UIApplication.shared.delegate
        if let window = appDelegate!.window { return window?.visibleViewController }
        return nil
    }
    
    public func closeAllMozoUIs(completion: (() -> Swift.Void)? = nil) {
        mozoNavigationController.viewControllers = []
        mozoNavigationController.dismiss(animated: false) {
            print("Mozo: Dismiss Navigation Controller")
            completion!()
        }
    }
}
