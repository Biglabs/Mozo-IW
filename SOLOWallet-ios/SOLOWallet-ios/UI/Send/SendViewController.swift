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
        self.inputCoinIconLabel.textColor = .white
        self.inputCoinIconLabel.addTextWithImage(text: "", image: UIImage.init(named: "ic_sort_ascending")!, imageBehindText: true, keepPreviousText: false)
        self.inputCoinIconLabel.roundCorners(corners: [.topLeft, .bottomLeft], radius: 5)
        self.inputCoinNameLabel?.backgroundColor = ThemeManager.shared.title
        self.inputCoinNameLabel?.textColor = .white
        self.inputCoinTextField.textColor = ThemeManager.shared.font
        self.inputCoinTextField.keyboardType = UIKeyboardType.decimalPad
        self.inputCoinTextField.addTarget(self, action: #selector(self.textFieldDidChange(_:)), for: .editingChanged)
        self.inputCoinTextField.delegate = self
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
        self.signButton.tintColor = .white
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
        
        self.validateCurrentTransaction()
    }
    
    func validateCurrentTransaction(){
        let input = InputDTO.init(addresses: [(self.currentCoin?.address)!])!
        let trimToAddress = self.addressTextField.text?.trimmingCharacters(in: .whitespacesAndNewlines)
        var value = 0.0
        if !(self.inputCoinTextField.text?.isEmpty)! {
            value = Double(self.inputCoinTextField.text!)!
        }
        var txValue = NSNumber(value: 0)
        if self.currentCoin?.isChild == true {
            txValue = value > 0.0 ? Utils.convertTokenValue(value: value, decimal: (self.currentCoin?.contract?.decimals)!) : 0
        } else {
            txValue = value > 0.0 ? Utils.convertCoinValue(coinType: self.currentCoin?.coin, value: value) : 0
        }
        
        let output = OutputDTO.init(addresses: [trimToAddress!], value: txValue)!
        let transaction = TransactionDTO.init(inputs: [input], outputs: [output])
        
        self.validateTransaction(transaction: transaction!)
    }
        
    func validateTransaction(transaction: TransactionDTO){
        let sv = self.displaySpinner(onView: self.view)
        if self.currentCoin?.isChild == true {
            self.createNewTokenTx(transaction, network: (self.currentCoin?.network)!, contractAddress: (self.currentCoin?.contract?.contractAddress)!){value, error in
                self.removeSpinner(spinner: sv)
                self.handleValidationResult(value: value, error: error)
            }
        } else {
            if self.currentCoin?.coin == CoinType.ETH.key {
                self.createNewEthTx(transaction, network: (self.currentCoin?.network)!){value, error in
                    self.removeSpinner(spinner: sv)
                    self.handleValidationResult(value: value, error: error)
                }
            } else if self.currentCoin?.coin == CoinType.BTC.key {
                self.createNewBtcTx(transaction, network: (self.currentCoin?.network)!){value, error in
                    self.removeSpinner(spinner: sv)
                    self.handleValidationResult(value: value, error: error)
                }
            }
        }
    }
    
    func handleValidationResult(value: Any?, error: Error?){
        guard let value = value, error == nil else {
            if let connectionError = error {
                Utils.showError(connectionError)
            }
            return
        }
        
        let json = SwiftyJSON.JSON(value)
        let interTx = IntermediaryTransactionDTO.init(json: json)!
        if (interTx.errors != nil) && (interTx.errors?.count)! > 0 {
            let error = ErrorDTO()
            error?.detail = interTx.errors?.first
            self.displayErrorAlert(error: error!)
            return
        }
        
        self.soloSDK.singner?.signTransaction(transaction: interTx, coinType: (self.currentCoin?.coin!)!, network: (self.currentCoin?.network)!){ result in
            self.handleSignResult(result:result)
        }
    }
    
    func handleSignResult(result: Result<String, ErrorDTO>){
        switch result {
        case .success(let signedTransaction):
            self.sendAlertController(signedTransaction)
        case .failure(let error):
            self.displayErrorAlert(error: error)
        }
    }
    
    func displayErrorAlert(error: ErrorDTO) {
        let alert = UIAlertController(title: error.title ?? "Error", message: error.detail, preferredStyle: .alert)
        alert.addAction(.init(title: "OK", style: .default, handler: nil))
        Utils.getTopViewController().present(alert, animated: true, completion: nil)
    }
    
    private func sendFund(_ signedTx: String) {
        self.resetValue()
        let sv = self.displaySpinner(onView: self.view)
        if self.currentCoin?.isChild == true {
            self.sendTokenTx(signedTx, network: (self.currentCoin?.network)!, contractAddress: (self.currentCoin?.contract?.contractAddress)!){value, error in
                self.removeSpinner(spinner: sv)
                self.handleSendTxResponse(value: value!, error: error)
            }
        } else {
            if self.currentCoin?.coin == CoinType.ETH.key {
                self.sendETH(signedTx, network: (self.currentCoin?.network)!){value, error in
                    self.removeSpinner(spinner: sv)
                    self.handleSendTxResponse(value: value!, error: error)
                }
            } else if self.currentCoin?.coin == CoinType.BTC.key {
                self.sendBTC(signedTx, network: (self.currentCoin?.network)!){value, error in
                    self.removeSpinner(spinner: sv)
                    self.handleSendTxResponse(value: value!, error: error)
                }
            }
        }
    }
    
    func handleSendTxResponse(value: Any?, error: Error?){
        guard let value = value, error == nil else {
            if let connectionError = error {
                Utils.showError(connectionError)
            }
            return
        }
        let json = SwiftyJSON.JSON(value)
        let interTx = IntermediaryTransactionDTO.init(json: json)!
        if (interTx.errors != nil) && (interTx.errors?.count)! > 0 {
            let error = ErrorDTO()
            error?.detail = interTx.errors?.first
            self.displayErrorAlert(error: error!)
            return
        }
        if let hash = interTx.tx?.hash {
            self.viewTransactionOnBrowser(hash)
            print("Transaction hash: ", hash)
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
            let baseUrl = Configuration.getScanURL(self.currentCoin?.coin, network: self.currentCoin?.network, isTestnet: true)
            let url = URL(string: "\(baseUrl)/\(txId)")
            UIApplication.shared.open(url!, options: [:], completionHandler: nil)
        }
        alertController.addAction(OKAction)
        self.present(alertController, animated: true, completion: nil)
    }
    
    func updateResultQRScan(value: String){
        if value.isValidReceiveFormat() {
            let url = URL(string: value)
            if url?.scheme != CoinType.BTC.scanName && url?.scheme != CoinType.ETH.scanName {
                // Display error
                return
            }
            let urlComponents = URLComponents(string: value)!
            let address = urlComponents.path
            let amount = urlComponents.queryItems?.first(where: { $0.name == "amount" })?.value
            // Transaction
            self.addressTextField.text = address
            self.inputCoinTextField.text = amount
        } else {
            // Address only
            self.addressTextField.text = value
        }
    }
}

extension SendViewController: UITextFieldDelegate {
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        // Validate decimal format
        let finalText = (textField.text ?? "") + string
        if (finalText.isValidDecimalFormat() == false){
            JDStatusBarNotification.show(withStatus: "Please input value in decimal format.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
            return false
        }
        return true
    }
}

extension SendViewController: SoloWalletDelegate {
    func updateCurrentAddress(_ address: AddressDTO) {
    }
    
    func updateAllAddresses(_ addresses: [AddressDTO]) {
    }
    
    func loadMoreTxHistory(_ blockHeight: Int64) {}
    func request(_ action: String) {}
    
    func updateValue(_ key: String, value: String) {
        self.updateResultQRScan(value: value)
    }
}
