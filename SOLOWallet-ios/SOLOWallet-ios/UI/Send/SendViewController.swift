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
        self.addressTextField.addTarget(self, action: #selector(self.addressTextFieldDidChange(_:)), for: .editingChanged)
        
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
    
    @objc func addressTextFieldDidChange(_ textField: UITextField) {
//        self.validateCurrentTransaction(isSigning: false)
    }
    
    override func updateAddress(_ sender: Any? = nil) {
        self.bindData()
    }
    
    func resetValue() {
        self.inputCoinTextField.text = ""
        self.addressTextField.text = ""
        self.addressTextField.resignFirstResponder()
        self.inputCoinTextField.resignFirstResponder()
        self.gasTextField?.resignFirstResponder()
        self.dataTextField.resignFirstResponder()
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
        
        guard let spendable = self.currentCoin?.balance, spendable > 0 else {
            JDStatusBarNotification.show(withStatus: "Your spendable is not enough fund.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
            return
        }
        
        if Double(value)! > (Double(gasLimit)! + spendable) {
            JDStatusBarNotification.show(withStatus: "Spendable is is not enough.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
            return
        }
        
        self.validateCurrentTransaction(isSigning: true)
    }
    
    func validateCurrentTransaction(isSigning: Bool){
        let input = InputDTO.init(addresses: [(self.currentCoin?.address)!])!
        let trimToAddress = self.addressTextField.text?.trimmingCharacters(in: .whitespacesAndNewlines)
        var value = 0.0
        if !(self.inputCoinTextField.text?.isEmpty)! {
            value = Double(self.inputCoinTextField.text!)!
        }
        let txValue = value > 0.0 ? convertOutputValue(value: value) : 0
        let output = OutputDTO.init(addresses: [trimToAddress!], value: txValue)!
        let transaction = TransactionDTO.init(inputs: [input], outputs: [output])
        
        self.validateTransaction(transaction: transaction!, isSigning: isSigning)
    }
    
    func convertOutputValue(value: Double) -> Int64{
        var retValue = Int64(0)
        if self.currentCoin?.coin == CoinType.ETH.key {
            //Convert value from ether to wei
            retValue = Int64(value * 1E+18)
        } else if self.currentCoin?.coin == CoinType.BTC.key {
            //Convert value from ether to wei
            retValue = Int64(value * 1E+8)
        }
        return retValue
    }
    
    func validateTransaction(transaction: TransactionDTO, isSigning: Bool){
        if self.currentCoin?.coin == CoinType.ETH.key {
            self.createNewEthTx(transaction){value, error in
                self.handleValidationResult(value: value, isSigning: isSigning)
            }
        } else if self.currentCoin?.coin == CoinType.BTC.key {
            self.createNewBtcTx(transaction){value, error in
                self.handleValidationResult(value: value, isSigning: isSigning)
            }
        }
    }
    
    func handleValidationResult(value: Any?, isSigning: Bool){
        if value != nil {
            let interTx = IntermediaryTransactionDTO.init(json: value as! JSON)!
            if isSigning {
                self.soloSDK.singner?.signTransaction(transaction: interTx, coinType: (self.currentCoin?.coin!)!, network: (self.currentCoin?.network)!){ result in
                    self.handleSignResult(result:result)
                }
            } else {
                let fee = Double((interTx.tx?.fees)!) / (self.currentCoin?.coin == CoinType.BTC.key ? 1E+8 : 1E+18)
                self.gasTextField?.text = String(format: "%f", fee)
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
            let baseUrl = Configuration.getScanURL(self.currentCoin?.coin, isTestnet: true)
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
