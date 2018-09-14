//
//  MozoSDK.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/27/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit

public class MozoSDK {
    private static var moduleDependencies = ModuleDependencies()
    
    public static func configure(key: String) {
        moduleDependencies.apiKey = key
    }
    
    public static func installRootViewControllerIntoWindow(_ window: UIWindow) {
        
        moduleDependencies.installRootViewControllerIntoWindow(window)
    }
    
    public static func authenticate() {
        moduleDependencies.authenticate()
    }
    
    public static func logout() {
        moduleDependencies.logout()
    }
}
