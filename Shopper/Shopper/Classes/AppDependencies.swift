//
//  AppDependencies.swift
//  Shopper
//
//  Created by Hoang Nguyen on 9/18/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation

import UIKit

class AppDependencies {
    var demoWireframe = DemoWireframe()
    
    init() {
        configureDependencies()
    }
    
    func installRootViewControllerIntoWindow(_ window: UIWindow) {
        demoWireframe.presentDemoInterfaceFromWindow(window)
    }
    
    func configureDependencies() {
        
    }
}
