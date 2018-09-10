//
//  AuthWireframe.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/10/18.
//

import Foundation

class AuthWireframe: NSObject {
    var authPresenter : AuthPresenter?
    var rootWireframe : RootWireframe?
    
    func presentInitialAuthInterface(){
        presentWaitingInterface()
        authPresenter?.performAuthentication()
    }
    
    func dismissAuthInterface(){
        
    }
    
    func presentWaitingInterface() {
        let viewController = WaitingViewControllerFromStoryboard()
        rootWireframe?.showRootViewController(viewController, inWindow: (UIApplication.shared.delegate?.window!)!)
    }
    
    func WaitingViewControllerFromStoryboard() -> MozoBasicViewController {
        let storyboard = StoryboardManager.mozoStoryboard()
        let viewController = storyboard.instantiateViewController(withIdentifier: WaitingViewControllerIdentifier) as! MozoBasicViewController
        return viewController
    }
}
