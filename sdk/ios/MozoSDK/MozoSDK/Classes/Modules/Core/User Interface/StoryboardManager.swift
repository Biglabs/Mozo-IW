//
//  StoryboardManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import UIKit

public class StoryboardManager {
    public static func mozoStoryboard() -> UIStoryboard{
        let mozoBundle = BundleManager.mozoBundle()
        let storyboard = UIStoryboard(name: "Mozo", bundle: mozoBundle)
        
        return storyboard
    }
    
    public static func initialViewController() -> UIViewController{
        let storyboard = mozoStoryboard()
        let vc = storyboard.instantiateInitialViewController()!
        return vc
    }
}
