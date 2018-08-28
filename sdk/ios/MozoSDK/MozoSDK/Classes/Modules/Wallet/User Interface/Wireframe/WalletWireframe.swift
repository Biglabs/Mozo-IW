//
//  WalletWireframe.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit

let PINViewControllerIdentifier = "PINViewController"
let CreatingInterfaceViewControllerIdentifier = "CreatingInterfaceViewController"
let BackupViewControllerIdentifier = "BackupViewController"

class WalletWireframe: NSObject {
    var walletPresenter : WalletPresenter?
    var rootWireframe : RootWireframe?
    var pinViewController : PINViewController?
    
    func presentPINInterfaceFromWindow(_ window: UIWindow) {
        let viewController = PINViewControllerFromStoryboard()
//        viewController.eventHandler = walletPresenter
        pinViewController = viewController
//        walletPresenter?.userInterface = viewController
        rootWireframe?.showViewController(viewController, inWindow: window)
    }
    
    func presentCreatingInterface() {

    }
    
    func presentBackupInterface() {
        
    }
    
    func PINViewControllerFromStoryboard() -> PINViewController {
        let storyboard = StoryboardManager.mozoStoryboard()
        let viewController = storyboard.instantiateViewController(withIdentifier: PINViewControllerIdentifier) as! PINViewController
        return viewController
    }
}
