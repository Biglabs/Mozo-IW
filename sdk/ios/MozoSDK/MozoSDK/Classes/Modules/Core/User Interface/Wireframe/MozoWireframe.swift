//
//  MozoWireframe.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/11/18.
//

import Foundation

class MozoWireframe: NSObject {
    var rootWireframe : RootWireframe?
    
    func dismissModuleInterface(){
        
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
    
    public func getTopViewController() -> UIViewController! {
        return rootWireframe?.getTopViewController()
    }
}
