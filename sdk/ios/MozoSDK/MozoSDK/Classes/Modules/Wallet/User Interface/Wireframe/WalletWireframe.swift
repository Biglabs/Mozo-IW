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
let PassPhraseViewControllerIdentifier = "PassPhraseViewController"

class WalletWireframe: NSObject {
    var walletPresenter : WalletPresenter?
    var rootWireframe : RootWireframe?
    var pinViewController : PINViewController?
    var passPhraseViewController: PassPhraseViewController?
    
    func presentPINInterface(passPharse: String?) {
        let viewController = PINViewControllerFromStoryboard()
        viewController.eventHandler = walletPresenter
        viewController.passPhrase = passPharse
        pinViewController = viewController
        walletPresenter?.pinUserInterface = viewController
        rootWireframe?.replaceRootViewController(viewController, inWindow: (UIApplication.shared.delegate?.window!)!)
    }
    
    func presentPassPhraseInterface() {
        let viewController = PassPhraseViewControllerFromStoryboard()
        viewController.eventHandler = walletPresenter
        passPhraseViewController = viewController
        walletPresenter?.passPharseUserInterface = viewController
        rootWireframe?.showRootViewController(viewController, inWindow: (UIApplication.shared.delegate?.window!)!)
    }
    
    func dismissWalletInterface() {
        
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
