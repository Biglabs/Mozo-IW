//
//  WalletWireframe.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit

class WalletWireframe: MozoWireframe {
    var walletPresenter : WalletPresenter?
    var pinViewController : PINViewController?
    var passPhraseViewController: PassPhraseViewController?
    
    func presentInitialWalletInterface() {
        walletPresenter?.processInitialWalletInterface()
    }
    
    func presentPINInterface(passPharse: String?, requestFrom module: Module = Module.Wallet) {
        let viewController = PINViewControllerFromStoryboard()
        viewController.eventHandler = walletPresenter
        viewController.passPhrase = passPharse
        viewController.moduleRequested = module
        
        pinViewController = viewController
        walletPresenter?.pinUserInterface = viewController
        rootWireframe?.displayViewController(viewController)
    }
    
    func presentPassPhraseInterface() {
        let viewController = PassPhraseViewControllerFromStoryboard()
        viewController.eventHandler = walletPresenter
        passPhraseViewController = viewController
        walletPresenter?.passPharseUserInterface = viewController
        rootWireframe?.displayViewController(viewController)
    }
    
    func dismissWalletInterface() {
        rootWireframe?.dismissTopViewController()
    }
    
    func PINViewControllerFromStoryboard() -> PINViewController {
        let storyboard = StoryboardManager.mozoStoryboard()
        let viewController = storyboard.instantiateViewController(withIdentifier: PINViewControllerIdentifier) as! PINViewController
        return viewController
    }
    
    func PassPhraseViewControllerFromStoryboard() -> PassPhraseViewController {
        let storyboard = StoryboardManager.mozoStoryboard()
        let viewController = storyboard.instantiateViewController(withIdentifier: PassPhraseViewControllerIdentifier) as! PassPhraseViewController
        return viewController
    }
}
