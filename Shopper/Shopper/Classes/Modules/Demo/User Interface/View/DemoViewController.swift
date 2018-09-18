//
//  DemoViewController.swift
//  Shopper
//
//  Created by Hoang Nguyen on 8/16/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import UIKit
import MozoSDK

class DemoViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        navigationItem.title = "DEMO COMPONENTS"
//        MozoSDK.authenticate()
//        MozoSDK.setAuthDelegate(self)
        MozoSDK.transferMozo()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}

extension DemoViewController: AuthenticationDelegate {
    func mozoAuthenticationDidFinish() {
        print("Mozo: Finish authentication")
    }
    
    func mozoLogoutDidFinish() {
        print("Mozo: Finish logout")
    }
    
    func mozoUIDidCloseAll() {
        print("Mozo: Did close all UIs")
    }
}
