//
//  SendViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

class SendViewController: AbstractViewController {
    
    //address
    @IBOutlet weak var addressView: UIView!
    @IBOutlet weak var addressTextField: UITextField!
    @IBOutlet weak var scannerButton: UIButton!
    @IBOutlet weak var scannerText: UIButton!
    
    //value coin
    @IBOutlet weak var inputCoinView: UIView!
    @IBOutlet weak var inputCoinLabel: EdgeInsetLabel!
    @IBOutlet weak var inputCoinTextField: UITextField!
    @IBOutlet weak var inputUSDLabel: UILabel!
    
    @IBOutlet weak var spendableTitleLabel: UILabel!
    @IBOutlet weak var spendableValueLabel: UILabel!
    
    //Gas limit
    @IBOutlet weak var gasView: UIView!
    @IBOutlet weak var gasTextField: UITextField!
    @IBOutlet weak var gasLabel: UILabel!
    
    @IBOutlet weak var dataTextField: UITextField!
    
    @IBOutlet weak var sendButton: UIButton!
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        self.automaticallyAdjustsScrollViewInsets = false
        self.navigationController?.navigationBar.isTranslucent = false
        self.tabBarController?.tabBar.isTranslucent = false
        
        //address
        self.addressView.layer.cornerRadius = 5
        self.addressView.layer.borderColor = ThemeManager.shared.border.cgColor
        self.addressView.layer.borderWidth = 0.5
        self.scannerButton.setImage(UIImage.init(named: "ic_scan_square"), for: .normal)
        self.scannerButton.tintColor = ThemeManager.shared.font
        self.scannerButton.addTarget(self, action: #selector(self.scanQRCode), for: .touchUpInside)
        self.scannerText.tintColor = ThemeManager.shared.font
        self.scannerText.addTarget(self, action: #selector(self.scanQRCode), for: .touchUpInside)
        self.scannerText.tintColor = ThemeManager.shared.font
        self.addressTextField.textColor = ThemeManager.shared.font
        
        //value coin
        self.inputCoinView.layer.cornerRadius = 5
        self.inputCoinView.layer.borderColor = ThemeManager.shared.border.cgColor
        self.inputCoinView.layer.borderWidth = 0.5
        self.inputCoinLabel.backgroundColor = ThemeManager.shared.title
        self.inputCoinLabel.roundCorners(corners: [.topLeft, .bottomLeft], radius: 5)
        self.inputCoinLabel.textColor = UIColor.white
        self.inputCoinLabel.addTextWithImage(text: " \(self.coin.name ?? "")", image: UIImage.init(named: "ic_sort_ascending")!, imageBehindText: false, keepPreviousText: false)
        self.inputUSDLabel.textColor = ThemeManager.shared.placeholder
        
        self.spendableTitleLabel.textColor = ThemeManager.shared.title
        self.spendableValueLabel.textColor = ThemeManager.shared.font
        
        //value coin
        self.gasView.layer.cornerRadius = 5
        self.gasView.layer.borderColor = ThemeManager.shared.border.cgColor
        self.gasView.layer.borderWidth = 0.5
        self.gasTextField.textColor = ThemeManager.shared.font
        self.gasLabel.textColor = ThemeManager.shared.disable
        
        self.dataTextField.layer.cornerRadius = 5
        self.dataTextField.layer.borderColor = ThemeManager.shared.border.cgColor
        self.dataTextField.layer.borderWidth = 0.5
        self.dataTextField.textColor = ThemeManager.shared.font
        self.dataTextField.setLeftPaddingPoints(10)
        
        self.sendButton.layer.cornerRadius = 5
        self.sendButton.backgroundColor = ThemeManager.shared.main
        self.sendButton.tintColor = UIColor.white
        
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
