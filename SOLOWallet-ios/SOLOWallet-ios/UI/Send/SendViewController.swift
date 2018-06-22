//
//  SendViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

public class SendViewController: AbstractViewController {
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        let barHeight: CGFloat = self.heightNavigationBar + self.heightStatusBarFrame + 1
        let displayWidth: CGFloat = self.view.frame.width
        let displayHeight: CGFloat = self.view.frame.height
        
        self.view.frame = CGRect(x: 0, y: barHeight, width: displayWidth, height: displayHeight - barHeight)
    }
}
