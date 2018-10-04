//
//  TxDetailViewController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation
import UIKit

class TxDetailViewController: MozoBasicViewController {
    var displayItem: TxDetailDisplayItem!
    
    @IBOutlet weak var lbTxType: UILabel!
    @IBOutlet weak var lbDateTime: UILabel!
    @IBOutlet weak var lbBalance: UILabel!
    @IBOutlet weak var lbBalanceExchange: UILabel!
    @IBOutlet weak var lbAddress: UILabel!
    @IBOutlet weak var lbAmountValue: UILabel!
    @IBOutlet weak var lbAmountValueExchange: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        enableBackBarButton()
        updateView()
    }
    
    func updateView() {
        lbTxType.text = displayItem.action

        lbDateTime.text = displayItem.dateTime
        
        let amount = displayItem.amount
        
        let reBalance = displayItem.currentBalance
        lbBalance.text = "\(reBalance)"
        
        lbAddress.text = displayItem.addressTo
        lbAmountValue.text = "\(amount)"
        
        var exBalance = "0.0"
        var exAmount = "0.0"
        
        if let rateInfo = SessionStoreManager.exchangeRateInfo {
            if let type = CurrencyType(rawValue: rateInfo.currency ?? "") {
                let rate = rateInfo.rate ?? 0
                let value = (displayItem.exCurrentBalance * rate).rounded(toPlaces: type.decimalRound)
                exBalance = "\(type.unit)\(value)"
                let amountValue = (displayItem.exAmount * rate).rounded(toPlaces: type.decimalRound)
                exAmount = "\(type.unit)\(amountValue)"
            }
        }
        
        lbBalanceExchange.text = exBalance
        lbAmountValueExchange.text = exAmount
    }
}
