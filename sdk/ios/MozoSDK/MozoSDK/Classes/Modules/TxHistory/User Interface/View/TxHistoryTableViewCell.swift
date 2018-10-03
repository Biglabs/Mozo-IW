//
//  TxHistoryTableViewCell.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 10/3/18.
//

import Foundation
import UIKit

public class TxHistoryTableViewCell: UITableViewCell {
    @IBOutlet weak var lbAction: UILabel!
    @IBOutlet weak var lbDateTime: UILabel?
    @IBOutlet weak var lbAmount: UILabel!
    @IBOutlet weak var lbExchangeValue: UILabel?
    var txHistory : TxHistoryDisplayItem? {
        didSet {
            bindData()
        }
    }
    
    public override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    
    func bindData(){
        lbAction.text = txHistory?.action
        lbDateTime?.text = txHistory?.date
        if txHistory?.action == TransactionType.Received.value {
            lbAmount.textColor = ThemeManager.shared.main
            lbAmount.text = "+ \(txHistory?.amount ?? 0) Mozo"
        } else {
            lbAmount.textColor = ThemeManager.shared.error
            lbAmount.text = "- \(txHistory?.amount ?? 0) Mozo"
        }
    }
}
