//
//  SendViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SwiftyJSON

class SendViewController: AbstractViewController {
    
    //address
    @IBOutlet weak var addressView: UIView!
    @IBOutlet weak var addressTextField: UITextField!
    @IBOutlet weak var scannerButton: UIButton!
    @IBOutlet weak var scannerText: UIButton!
    
    //value coin
    @IBOutlet weak var inputCoinView: UIView!
    @IBOutlet weak var inputCoinIconLabel: EdgeInsetLabel!
    @IBOutlet weak var inputCoinNameLabel: EdgeInsetLabel!
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
        self.inputCoinIconLabel.backgroundColor = ThemeManager.shared.title
        self.inputCoinIconLabel.textColor = UIColor.white
        self.inputCoinIconLabel.addTextWithImage(text: "", image: UIImage.init(named: "ic_sort_ascending")!, imageBehindText: true, keepPreviousText: false)
        self.inputCoinIconLabel.roundCorners(corners: [.topLeft, .bottomLeft], radius: 5)
        self.inputCoinNameLabel.backgroundColor = ThemeManager.shared.title
        self.inputCoinNameLabel.textColor = UIColor.white
        self.inputCoinTextField.textColor = ThemeManager.shared.font
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
        
        self.bindData()
    }
    
    func bindData() {
        self.inputCoinNameLabel.text = self.coin.name ?? ""
        self.inputUSDLabel.text = "US$7,500.52"
        self.spendableValueLabel.text = "\(self.coin.addesses?.first?.balance ?? 0.0) \(self.coin.name ?? "")"
        self.addressTextField.text = "0x213DE50319F5954D821F704d46e4fd50Fb09B459"
    }
    
    @objc func scanQRCode() {
        let scannerVC = ScannerViewController()
        scannerVC.delegate = self
        let nav = UINavigationController(rootViewController: scannerVC)
        self.present(nav, animated: true, completion: nil)
    }
    
    @IBAction func touchedBtnSend(_ sender: Any) {
        //solosigner://{"action":"SIGN","receiver":"com.biglabs.solo.wallet.solowallet","params":{"from":"0x011df24265841dCdbf2e60984BB94007b0C1d76A","to":"0x213DE50319F5954D821F704d46e4fd50Fb09B459","coinType":"ETH","value":"0.5","txData":"vbh"}}
        var urlStr = URL_SCHEME.Sender.scheme + "://"
        
        let transaction = TransactionDTO()
        transaction?.from = self.coin.addesses?.first?.address ?? "0x011df24265841dCdbf2e60984BB94007b0C1d76A"
        transaction?.to = self.addressTextField.text ?? "0x213DE50319F5954D821F704d46e4fd50Fb09B459"
        transaction?.value = 0.05
        let model = CommunicationDTO(action: ACTIONTYPE.SIGN, receiver: URL_SCHEME.Receiver.scheme, params: transaction, coinType: COINTYPE.ETH)
        urlStr += (model?.rawString())!
        print("URL: [\(urlStr)]")
        let url = URL(string : urlStr.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)!)!
        if (UIApplication.shared.canOpenURL(url as URL)) {
            if #available(iOS 10.0, *) {
                UIApplication.shared.open(url, options: ["":""], completionHandler: nil)
            } else {
                UIApplication.shared.openURL(url)
            }
        }
    }
}

class Transaction {
    
}

extension SendViewController: SoloWalletDelegate {
    func updateValue(_ key: String, value: String) {
        self.addressTextField.text = value
    }
}
