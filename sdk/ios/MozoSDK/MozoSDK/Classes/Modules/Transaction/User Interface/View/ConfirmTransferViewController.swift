//
//  ConfirmTransferViewController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation
import UIKit

class ConfirmTransferViewController: MozoBasicViewController {
    var eventHandler : TransactionModuleInterface?
    
    @IBOutlet weak var lbBalance: UILabel!
    @IBOutlet weak var lbExchange: UILabel!
    @IBOutlet weak var lbAddress: UILabel!
    @IBOutlet weak var lbAmountValue: UILabel!
    @IBOutlet weak var lbAmountValueExchange: UILabel!
    @IBOutlet weak var addressBookView: UIView!
    @IBOutlet weak var lbName: UILabel!
    @IBOutlet weak var lbNameAddress: UILabel!
    
    var transaction : TransactionDTO?
    var tokenInfo: TokenInfoDTO?
    var displayName: String?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        enableBackBarButton()
        updateView()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        // Fix issue: Title is not correct after showing alert
        self.title = "CONFIRMATION"
    }
    
    func updateView() {
        let balance = tokenInfo?.balance ?? 0
        let displayBalance = balance.convertOutputValue(decimal: tokenInfo?.decimals ?? 0)
        lbBalance.text = "\(displayBalance)"
        
        lbAddress.text = transaction?.outputs?.first?.addresses![0]
        let amount = transaction?.outputs?.first?.value?.convertOutputValue(decimal: tokenInfo?.decimals ?? 0) ?? 0.0
        lbAmountValue.text = "(\(amount))"
        
        if let displayName = displayName {
            lbAddress.isHidden = true
            addressBookView.isHidden = false
            lbName.text = displayName
            lbNameAddress.text = lbAddress.text
        }
        
        var exBalance = "0.0"
        var exAmount = "0.0"
        
        if let rateInfo = SessionStoreManager.exchangeRateInfo {
            if let type = CurrencyType(rawValue: rateInfo.currency ?? "") {
                let rate = rateInfo.rate ?? 0
                let value = (displayBalance * rate).rounded(toPlaces: type.decimalRound)
                exBalance = "\(type.unit)\(value)"
                let amountValue = (amount * rate).rounded(toPlaces: type.decimalRound)
                exAmount = "\(type.unit)\(amountValue)"
            }
        }
        
        lbExchange.text = exBalance
        lbAmountValueExchange.text = exAmount
    }
    
    @IBAction func btnSendTapped(_ sender: Any) {
        eventHandler?.sendConfirmTransaction(transaction!)
    }
}

extension ConfirmTransferViewController : ConfirmTransferViewInterface {
    func displaySpinner() {
        displayMozoSpinner()
    }
    
    func removeSpinner() {
        removeMozoSpinner()
    }
    
    func displayError(_ error: String) {
        displayMozoError(error)
    }
}
