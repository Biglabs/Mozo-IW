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
        lbAmountValue.text = "\((transaction?.outputs?.first?.value?.convertOutputValue(decimal: tokenInfo?.decimals ?? 0))!)"
        
        if let displayName = displayName {
            lbAddress.isHidden = true
            addressBookView.isHidden = false
            lbName.text = displayName
            lbNameAddress.text = lbAddress.text
        }
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
