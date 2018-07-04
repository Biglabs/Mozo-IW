//
//  SendViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import Result
import SoloSDK
import SwiftyJSON
import JDStatusBarNotification

class SendViewController: AbstractViewController {
    
    //address
    @IBOutlet weak var addressView: UIView!
    @IBOutlet weak var addressTextField: UITextField!
    @IBOutlet weak var scannerButton: UIButton!
    @IBOutlet weak var scannerText: UIButton!
    
    //value coin
    @IBOutlet weak var inputCoinView: UIView!
    @IBOutlet weak var coinBackgroundView: UIView!
    @IBOutlet weak var inputCoinIconLabel: UILabel!
    @IBOutlet weak var inputCoinNameLabel: UILabel?
    @IBOutlet weak var inputCoinTextField: UITextField!
    @IBOutlet weak var inputUSDLabel: UILabel?
    
    @IBOutlet weak var spendableTitleLabel: UILabel!
    @IBOutlet weak var spendableValueLabel: UILabel?
    
    //Gas limit
    @IBOutlet weak var gasView: UIView!
    @IBOutlet weak var gasTextField: UITextField?
    @IBOutlet weak var gasLabel: UILabel!
    
    @IBOutlet weak var dataTextField: UITextField!
    
    @IBOutlet weak var signButton: UIButton!
    
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
        self.coinBackgroundView.backgroundColor = ThemeManager.shared.title
        self.coinBackgroundView.roundCorners(corners: [.topLeft, .bottomLeft], radius: 5)
        self.inputCoinIconLabel.backgroundColor = ThemeManager.shared.title
        self.inputCoinIconLabel.textColor = UIColor.white
        self.inputCoinIconLabel.addTextWithImage(text: "", image: UIImage.init(named: "ic_sort_ascending")!, imageBehindText: true, keepPreviousText: false)
        self.inputCoinIconLabel.roundCorners(corners: [.topLeft, .bottomLeft], radius: 5)
        self.inputCoinNameLabel?.backgroundColor = ThemeManager.shared.title
        self.inputCoinNameLabel?.textColor = UIColor.white
        self.inputCoinTextField.textColor = ThemeManager.shared.font
        self.inputCoinTextField.keyboardType = UIKeyboardType.decimalPad
        self.inputCoinTextField.addTarget(self, action: #selector(self.textFieldDidChange(_:)), for: .editingChanged)
        self.inputUSDLabel?.textColor = ThemeManager.shared.placeholder
        
        self.spendableTitleLabel.textColor = ThemeManager.shared.title
        self.spendableValueLabel?.textColor = ThemeManager.shared.font
        
        //value coin
        self.gasView.layer.cornerRadius = 5
        self.gasView.layer.borderColor = ThemeManager.shared.border.cgColor
        self.gasView.layer.borderWidth = 0.5
        self.gasTextField?.textColor = ThemeManager.shared.font
        self.gasTextField?.keyboardType = UIKeyboardType.decimalPad
        self.gasLabel.textColor = ThemeManager.shared.disable
        
        self.dataTextField.layer.cornerRadius = 5
        self.dataTextField.layer.borderColor = ThemeManager.shared.border.cgColor
        self.dataTextField.layer.borderWidth = 0.5
        self.dataTextField.textColor = ThemeManager.shared.font
        self.dataTextField.setLeftPaddingPoints(10)
        
        self.signButton.layer.cornerRadius = 5
        self.signButton.backgroundColor = ThemeManager.shared.main
        self.signButton.tintColor = UIColor.white
        self.signButton.addTarget(self, action: #selector(self.signButtonTapped(_:)), for: .touchUpInside)
        
        self.bindData()
    }
    
    func bindData() {
        let coinName = self.currentCoin?.coin ?? ""
        let balance = self.currentCoin?.balance ?? 0.0
        
        self.inputCoinNameLabel?.text = "\(coinName)   "
        self.spendableValueLabel?.text = "\(balance) \(coinName)"
        self.gasTextField?.text = "250.000"
    }
    
    @objc func textFieldDidChange(_ textField: UITextField) {
        var balance = 0.0
        if let value = textField.text, value != "" {
            balance = Double(value)!
            
        }
        if let usd = self.currentCoin?.usd {
            self.inputUSDLabel?.text = "US$\(Utils.roundDouble(usd*balance))"
        }
    }
    
    override func updateAddress(_ sender: Any? = nil) {
        self.bindData()
    }
    
    func resetValue() {
        self.inputCoinTextField.text = ""
        self.addressTextField.text = ""
    }
    
    @objc func signedTransaction(_ notification: NSNotification) {
        if let signedTx = notification.userInfo?["signedTx"] as? String {
            self.sendAlertController(signedTx)
        }
    }
    
    @objc func scanQRCode() {
        let scannerVC = ScannerViewController()
        scannerVC.delegate = self
        let nav = UINavigationController(rootViewController: scannerVC)
        self.present(nav, animated: true, completion: nil)
    }
    
    @IBAction func signButtonTapped(_ sender: Any) {
        guard let toAddress = self.addressTextField.text, toAddress != "" else {
            JDStatusBarNotification.show(withStatus: "Please input receive address.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
            return
        }
        
        guard let value = self.inputCoinTextField.text, value != "" else {
            JDStatusBarNotification.show(withStatus: "Please input value.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
            return
        }
        
        guard let gasLimit = self.gasTextField?.text, gasLimit != "" else {
            JDStatusBarNotification.show(withStatus: "Please input gas limit.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
            return
        }
        
        guard let from = self.currentCoin?.address, from != "" else {
            JDStatusBarNotification.show(withStatus: "Please handshake to signer.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
            return
        }
        
        guard let balance = self.currentCoin?.balance, balance > 0 else {
            JDStatusBarNotification.show(withStatus: "Your spendable is not enough fund.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
            return
        }
        
        //ETH only
        if (value == "0" || (Double(value)! < 0.001)) {
            JDStatusBarNotification.show(withStatus: "Amount is below the minimum (0.001 ETH)", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
            return
        }
        
        if Double(value)! > (Double(gasLimit)! + balance) {
            JDStatusBarNotification.show(withStatus: "Spendable is is not enough.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
            return
        }
        
        
        // validate gas for each coin
        
        // sign eth
        if self.currentCoin?.coin == CoinType.ETH.key {
            if self.validateETH() {
                let transaction = ETH_TransactionDTO.init(from: from, to: toAddress, value: Double(value)!, gasPrice: 0, gasLimit: Double(gasLimit)!)!
                self.signTransactionETH(transaction: transaction)
            }
        } else if self.currentCoin?.coin == CoinType.BTC.key {
            if self.validateBTC() {
                let input = InputDTO.init(addresses: [from])!
                let output = OutputDTO.init(addresses: [toAddress], value: Double(value)!)!
                let tx = BTC_TransactionDTO.init(inputs: [input], outputs: [output])!
                self.signTransactionBTC(transaction: tx)
            }
        }
    }
    
    func handleSignResult(result: Result<String, SignerError>){
        switch result {
        case .success(let signedTransaction):
            self.sendAlertController(signedTransaction)
        case .failure(let error):
            let alert = UIAlertController(title: "Signed Message", message: "", preferredStyle: .alert)
            alert.title = alert.title! + " Error"
            alert.message = error.localizedDescription
            alert.addAction(.init(title: "OK", style: .default, handler: nil))
            Utils.getTopViewController().present(alert, animated: true, completion: nil)
        }
    }
    
    private func sendBTC(_ signedTx: String){
        self.soloSDK?.api?.sendTransaction(signedTx) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let backendError = error {
                    Utils.showError(backendError)
                }
                return
            }
            
            let json = SwiftyJSON.JSON(value)
            if let tx = json["tx"].string {
                let txJson = SwiftyJSON.JSON(tx)
                if let hash = txJson["hash"].string {
                    self.viewTransactionOnBrowser(hash)
                }
            }
        }
    }
    
    private func sendETH(_ signedTx: String){
        let params = ["jsonrpc": "2.0", "id": 1, "method": "eth_sendRawTransaction", "params": [signedTx]] as [String : Any]
        self.soloSDK?.api?.infuraPOST(params) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let backendError = error {
                    Utils.showError(backendError)
                }
                return
            }
            
            let json = SwiftyJSON.JSON(value)
            if let result = json["result"].string {
                self.viewTransactionOnBrowser(result)
            }
        }
    }
    
    private func sendFund(_ signedTx: String) {
        self.resetValue()
        if self.currentCoin?.coin == CoinType.ETH.key {
            self.sendETH(signedTx)
        } else if self.currentCoin?.coin == CoinType.BTC.key {
            self.sendBTC(signedTx)
        }
    }
    
    private func sendAlertController(_ signedTx: String) {
        let alertController = UIAlertController(title: "Transaction signed.", message: "Are you sure you want to send this fund?", preferredStyle: .alert)
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel) { (action) in
            self.resetValue()
        }
        alertController.addAction(cancelAction)
        
        let OKAction = UIAlertAction(title: "Ok", style: .default) { (action) in
            self.sendFund(signedTx)
        }
        alertController.addAction(OKAction)
        self.present(alertController, animated: true, completion: nil)
    }
    
    func viewTransactionOnBrowser(_ txId: String) {
        let alertController = UIAlertController(title: "Sent.", message: "Are you want to view this transaction info on browser?", preferredStyle: .alert)
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel, handler:  nil)
        alertController.addAction(cancelAction)
        
        let OKAction = UIAlertAction(title: "Ok", style: .default) { (action) in
            let baseUrl = self.currentCoin?.coin == CoinType.BTC.key ? Configuration.BLOCK_CYPHER_SCAN_URL : Configuration.ROPSTEN_ETHERSCAN_URL
            let url = URL(string: "\(baseUrl)/\(txId)")
            UIApplication.shared.open(url!, options: [:], completionHandler: nil)
        }
        alertController.addAction(OKAction)
        self.present(alertController, animated: true, completion: nil)
    }
}

extension SendViewController: SoloWalletDelegate {
    func request(_ action: String) {}
    
    func updateValue(_ key: String, value: String) {
        self.addressTextField.text = value
    }
}
