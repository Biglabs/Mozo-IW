//
//  PINViewController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit
import SmileLock

class PINViewController : UIViewController, PINViewInterface {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        configureView()
    }
    
    func configureView() {
        let kPasswordDigit = 6
        let passwordContainerView = PasswordContainerView.create(withDigit: kPasswordDigit)
        passwordContainerView.highlightedColor = UIColor.blue
    }
}
