//
//  ThemeManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit
import UIKit.NSAttributedString

public struct Theme {
    public var title: UIColor = UIColor(hexString: "141a22")
    public var font: UIColor = UIColor(hexString: "747474")
    public var placeholder: UIColor = UIColor(hexString: "c1c1c1")
    public var disable: UIColor = UIColor(hexString: "d1d7dd")
    public var highlight: UIColor = UIColor(hexString: "003c8d")
    public var main: UIColor = UIColor(hexString: "5a9cf5")
    public var border: UIColor = UIColor(hexString: "e0e0e0")
    public var background: UIColor = UIColor(hexString: "fff")
    public var menu: UIColor = UIColor(hexString: "f3f3f3")
    public var error: UIColor = UIColor(hexString: "f05454")
    public var success: UIColor = UIColor(hexString: "17b978")
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
        navigationBarAppearace.barTintColor = .white
        navigationBarAppearace.titleTextAttributes = [
            NSAttributedStringKey.foregroundColor: UIColor.black
        ]
    }
}
