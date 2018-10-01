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
    @IBOutlet weak var txtAddress: UITextField!
    @IBOutlet weak var btnAddressBook: UIButton!
    @IBOutlet weak var btnScan: UIButton!
    @IBOutlet weak var txtAmount: UITextField!
    @IBOutlet weak var lbSpendable: UILabel!
    @IBOutlet weak var btnContinue: UIButton!
    
    private let refreshControl = UIRefreshControl()
    var tokenInfo : TokenInfoDTO?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        eventHandler?.loadTokenInfo()
        setBtnLayer()
        addDoneButtonOnKeyboard()
//        setRefreshControl()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        // Fix issue: Title is not correct after navigation back from child controller
        self.title = "SEND MOZO OFFCHAIN"
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
    }
    
    @objc func doneButtonAction()
    {
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
    }
    
    @IBAction func btnScanTapped(_ sender: Any) {
        eventHandler?.showScanQRCodeInterface()
    }
    
    @IBAction func btnContinueTapped(_ sender: Any) {
        if let tokenInfo = self.tokenInfo {
            eventHandler?.validateTransferTransaction(tokenInfo: tokenInfo, toAdress: txtAddress.text, amount: txtAmount.text)
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
    }
    
    func updateUserInterfaceWithAddress(_ address: String) {
        txtAddress.text = address
    }
    
    func displayError(_ error: String) {
        displayMozoError(error)
    }
}
