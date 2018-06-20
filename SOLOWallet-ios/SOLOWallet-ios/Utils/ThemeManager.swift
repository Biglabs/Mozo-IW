//
//  ThemeManager.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import UIKit
import UIKit.NSAttributedString

public struct Theme {
    public var font: UIColor = UIColor(hexString: "464646")
    public var background: UIColor = UIColor(hexString: "CED0D4")
    public var main: UIColor = UIColor(hexString: "2dad60")
    public var border: UIColor = UIColor(hexString: "616770")
}

public struct ThemeManager {
    public static var shared: Theme {
        return Theme()
    }
    
    public static func applyTheme() {
        UIApplication.shared.delegate?.window??.tintColor = shared.main
        UIApplication.shared.statusBarStyle = .default
        
        let navigationBarAppearace = UINavigationBar.appearance()
        navigationBarAppearace.tintColor = shared.main
        navigationBarAppearace.barTintColor = UIColor.white
        
        navigationBarAppearace.titleTextAttributes = [
            NSAttributedStringKey.foregroundColor: UIColor.black
        ]
    }
}
