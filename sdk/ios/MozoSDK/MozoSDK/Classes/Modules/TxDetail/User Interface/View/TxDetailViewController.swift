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
        lbTxType.text = displayItem.action ?? displayItem.buildAction()

        lbDateTime.text = displayItem.buildDateString()
        
        let amount = displayItem.amount.convertOutputValue(decimal: displayItem.decimal)
        
        let reBalance = displayItem.currentBalance.convertOutputValue(decimal: displayItem.decimal) - amount
        lbBalance.text = "\(reBalance)"
        
        lbAddress.text = displayItem.addressTo
        lbAmountValue.text = "\(amount)"
    }
}
