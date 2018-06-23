//
//  SendViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

class SendViewController: AbstractViewController {
    
    @IBOutlet weak var addressTextField: UITextField!
    @IBOutlet weak var scannerButton: UIButton!
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        self.automaticallyAdjustsScrollViewInsets = false
        self.navigationController?.navigationBar.isTranslucent = false
        self.tabBarController?.tabBar.isTranslucent = false
        
        self.scannerButton.addTarget(self, action: #selector(self.scanQRCode), for: .touchUpInside)
    }
    
    @objc func scanQRCode() {
        let scannerVC = ScannerViewController()
        scannerVC.delegate = self
        let nav = UINavigationController(rootViewController: scannerVC)
        self.present(nav, animated: true, completion: nil)
    }
}

extension SendViewController: SoloWalletDelegate {
    func updateValue(_ key: String, value: String) {
        self.addressTextField.text = value
    }
}
