//
//  TransferViewController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/18/18.
//

import Foundation
import UIKit

class TransferViewController: MozoBasicViewController {
    var eventHandler : TransactionModuleInterface?
    @IBOutlet weak var lbBalance: UILabel!
    @IBOutlet weak var lbExchange: UILabel!
    @IBOutlet weak var lbReceiverAddress: UILabel!
    @IBOutlet weak var txtAddress: UITextField!
    @IBOutlet weak var lbValidateAddrError: UILabel!
    @IBOutlet weak var btnAddressBook: UIButton!
    @IBOutlet weak var btnScan: UIButton!
    @IBOutlet weak var lbAmount: UILabel!
    @IBOutlet weak var txtAmount: UITextField!
    @IBOutlet weak var lbValidateAmountError: UILabel!
    @IBOutlet weak var lbExchangeAmount: UILabel!
    @IBOutlet weak var amountBorderView: UIView!
    @IBOutlet weak var spendableView: UIView!
    @IBOutlet weak var lbSpendable: UILabel!
    @IBOutlet weak var addressBookView: UIView!
    @IBOutlet weak var lbAbName: UILabel!
    @IBOutlet weak var lbAbAddress: UILabel!
    @IBOutlet weak var btnContinue: UIButton!
    
    private let refreshControl = UIRefreshControl()
    var tokenInfo : TokenInfoDTO?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        eventHandler?.loadTokenInfo()
        setBtnLayer()
        setTextFieldLayer()
        addDoneButtonOnKeyboard()
        
        // Add a "textFieldDidChange" notification method to the text field control.
        txtAddress.addTarget(self, action: #selector(textFieldAddressDidChange), for: UIControlEvents.editingChanged)
        txtAmount.addTarget(self, action: #selector(textFieldAmountDidChange), for: UIControlEvents.editingChanged)
        txtAmount.delegate = self
//        setRefreshControl()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        // Fix issue: Title is not correct after navigation back from child controller
        self.title = "SEND MOZO OFFCHAIN"
    }
    
    func setTextFieldLayer() {
        txtAddress.setBottomBorder()
    }
    
    func setBtnLayer() {
        btnAddressBook.layer.borderWidth = 1
        btnAddressBook.layer.borderColor = ThemeManager.shared.main.cgColor
        btnScan.layer.borderWidth = 1
        btnScan.layer.borderColor = ThemeManager.shared.main.cgColor
    }
    
    func addDoneButtonOnKeyboard()
    {
        let doneToolbar: UIToolbar = UIToolbar(frame: CGRect(x: 0, y: 0, width: 320, height: 50))
        doneToolbar.barStyle = UIBarStyle.default
        
        let flexSpace = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.flexibleSpace, target: nil, action: nil)
        let done: UIBarButtonItem = UIBarButtonItem(title: "Done", style: UIBarButtonItemStyle.done, target: self, action: #selector(self.doneButtonAction))
        
        doneToolbar.items = [flexSpace, done]
        doneToolbar.sizeToFit()
        
        self.txtAmount.inputAccessoryView = doneToolbar
        self.txtAddress.inputAccessoryView = doneToolbar
    }
    
    @objc func doneButtonAction()
    {
        txtAddress.resignFirstResponder()
        txtAmount.resignFirstResponder()
    }
    
    // MARK: Refresh Control
    func setRefreshControl() {
        view.addSubview(refreshControl)
        self.refreshControl.addTarget(self, action: #selector(self.refresh(_:)), for: .valueChanged)
    }
    
    @objc func refresh(_ sender: Any? = nil) {
        eventHandler?.loadTokenInfo()
        if let refreshControl = sender as? UIRefreshControl, refreshControl.isRefreshing {
            refreshControl.endRefreshing()
        }
    }
    
    // MARK: Button tap events
    @IBAction func btnAddressBookTapped(_ sender: Any) {
        eventHandler?.showAddressBookInterface()
    }
    
    @IBAction func btnScanTapped(_ sender: Any) {
        eventHandler?.showScanQRCodeInterface()
    }
    @IBAction func touchedBtnClear(_ sender: Any) {
        clearAndHideAddressBookView()
        txtAddress.text = ""
    }
    
    @IBAction func btnContinueTapped(_ sender: Any) {
        if let tokenInfo = self.tokenInfo {
            let receiverAddress = txtAddress.isHidden ? lbAbAddress.text : txtAddress.text
            eventHandler?.validateTransferTransaction(tokenInfo: tokenInfo, toAdress: receiverAddress, amount: txtAmount.text, displayName: txtAddress.isHidden ? lbAbName.text : nil)
        }
    }
    
    func clearAndHideAddressBookView() {
        txtAddress.isHidden = false
        addressBookView.isHidden = true
        lbAbName.text = ""
        lbAbAddress.text = ""
    }
    
    // MARK: Validation
    
    @objc func textFieldAddressDidChange() {
        print("TextFieldAddressDidChange")
        hideValidate(isAddress: true)
    }
    
    @objc func textFieldAmountDidChange() {
        print("TextFieldAmountDidChange")
        if let rateInfo = SessionStoreManager.exchangeRateInfo {
            if let type = CurrencyType(rawValue: rateInfo.currency ?? "") {
                let value = Double(txtAmount.text ?? "0")!
                let exValue = (value * (rateInfo.rate ?? 0)).rounded(toPlaces: type.decimalRound)
                let exValueStr = "\(type.unit)\(exValue )"
                lbExchangeAmount.text = exValueStr
            }
        }
    }
    
    func showValidate(_ error: String?, isAddress: Bool) {
        print("Show validate error, isAddress: \(isAddress)")
        if isAddress {
            lbReceiverAddress.textColor = ThemeManager.shared.error
            txtAddress.setBorderBottomLine(isError: true)
            lbValidateAddrError.isHidden = false
        } else {
            lbValidateAmountError.text = error
            lbAmount.textColor = ThemeManager.shared.error
            amountBorderView.backgroundColor = ThemeManager.shared.error
            lbValidateAmountError.isHidden = false
            spendableView.isHidden = true
        }
    }
    
    func hideValidate(isAddress: Bool) {
        if isAddress {
            lbReceiverAddress.textColor = ThemeManager.shared.textContent
            txtAddress.setBorderBottomLine(isError: false)
            lbValidateAddrError.isHidden = true
        } else {
            lbAmount.textColor = ThemeManager.shared.textContent
            amountBorderView.backgroundColor = ThemeManager.shared.disable
            lbValidateAmountError.isHidden = true
            spendableView.isHidden = false
        }
    }
}

extension TransferViewController : TransferViewInterface {
    func updateUserInterfaceWithTokenInfo(_ tokenInfo: TokenInfoDTO) {
        self.tokenInfo = tokenInfo
        let balance = tokenInfo.balance ?? 0
        let displayBalance = balance.convertOutputValue(decimal: tokenInfo.decimals!)
        
        lbBalance.text = "\(displayBalance)"
        lbSpendable.text = "\(displayBalance)"
        
        var exBalance = "0.0"
        
        if let rateInfo = SessionStoreManager.exchangeRateInfo {
            if let type = CurrencyType(rawValue: rateInfo.currency ?? "") {
                let value = (displayBalance * (rateInfo.rate ?? 0)).rounded(toPlaces: type.decimalRound)
                exBalance = "\(type.unit)\(value)"
            }
        }
        
        lbExchange.text = exBalance
    }
    
    func updateUserInterfaceWithAddress(_ address: String) {
        clearAndHideAddressBookView()
        txtAddress.text = address
        hideValidate(isAddress: true)
    }
    
    func displayError(_ error: String) {
        displayMozoError(error)
    }
    
    func updateInterfaceWithDisplayItem(_ displayItem: AddressBookDisplayItem) {
        hideValidate(isAddress: true)
        txtAddress.isHidden = true
        addressBookView.isHidden = false
        lbAbName.text = displayItem.name
        lbAbAddress.text = displayItem.address
    }
    
    func showErrorValidation(_ error: String?, isAddress: Bool) {
        showValidate(error, isAddress: isAddress)
    }
    
    func hideErrorValidation() {
        hideValidate(isAddress: true)
        hideValidate(isAddress: false)
    }
}

extension TransferViewController: UITextFieldDelegate {
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        // Validate decimal format
        let finalText = (textField.text ?? "") + string
        if (finalText.isValidDecimalFormat() == false){
            showValidate("Error: Please input value in decimal format.", isAddress: false)
            return false
        }
        hideValidate(isAddress: false)
        return true
    }
}
