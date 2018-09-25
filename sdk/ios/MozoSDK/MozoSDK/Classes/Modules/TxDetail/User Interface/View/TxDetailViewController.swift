//
//  TxDetailViewController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation
import UIKit

class TxDetailViewController: MozoBasicViewController {
    var transaction: IntermediaryTransactionDTO?
    var tokenInfo: TokenInfoDTO?
    
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
        var action = ""
        if tokenInfo?.address == transaction?.tx?.inputs![0].addresses![0] {
            action = "SENT"
        } else {
            action = "RECEIVED"
        }
        lbTxType.text = action
        
        let amount = transaction?.tx?.outputs![0].value?.convertOutputValue(decimal: tokenInfo?.decimals ?? 0)
        
        let reBalance = (tokenInfo?.balance?.convertOutputValue(decimal: tokenInfo?.decimals ?? 0))! - amount!
        lbBalance.text = "\(reBalance)"
        
        lbAddress.text = transaction?.tx?.outputs![0].addresses![0]
        lbAmountValue.text = "\(amount ?? 0.0)"
    }
}
