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
        let podBundle = Bundle.init(for: MozoSDK.self)
        
        let bundleURL = podBundle.url(forResource: "MozoSDK", withExtension: "bundle")
        let bundle = Bundle.init(url: bundleURL!)!
        let storyboard = UIStoryboard(name: "Mozo", bundle: bundle)
        
        return storyboard
    }
    
    public static func initialViewController() -> UIViewController{
        let storyboard = mozoStoryboard()
        let vc = storyboard.instantiateInitialViewController()!
        return vc
    }
}
