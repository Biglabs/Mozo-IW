//
//  TransactionWalletTableViewCell.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/21/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

public class TransactionWalletTableViewCell: UITableViewCell {
    
    @IBOutlet weak var dayLabel: UILabel!
    @IBOutlet weak var monthLabel: UILabel!
    @IBOutlet weak var timeView: UIView!
    @IBOutlet weak var typeLabel: UILabel!
    @IBOutlet weak var valueLabel: UILabel!
    @IBOutlet weak var usdLabel: UILabel!
    @IBOutlet weak var valueHighlightLabel: UILabel!
    @IBOutlet weak var borderBottom: UIView!
    
    public override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.dayLabel.textColor = UIColor.white
        self.monthLabel.textColor = UIColor.white
        self.timeView.layer.cornerRadius = 5
        self.timeView.backgroundColor = ThemeManager.shared.main
        self.typeLabel.textColor = ThemeManager.shared.font
        self.valueHighlightLabel.textColor = ThemeManager.shared.main
        self.valueLabel.textColor = ThemeManager.shared.font
        self.usdLabel.textColor = ThemeManager.shared.font
        self.borderBottom.backgroundColor = ThemeManager.shared.border
    }
    
    public func bindData(_ transaction: TransactionHistoryDTO, coinName: String, address: String){
        if let time = transaction.time {
            self.dayLabel.text = Utils.convertInt64ToStringWithFormat(time, format: "dd")
            self.monthLabel.text = Utils.convertInt64ToStringWithFormat(time, format: "MMM")
        }

        // If type = ETH
        var from = ""
        var to = ""
        var value = 0.0
        // If type = BTC
        if coinName == CoinType.ETH.key {
            
        } else if coinName == CoinType.BTC.key {
            
        }
        
        if from == address {
            self.typeLabel.text = "Sent"
        } else if to == address {
            self.typeLabel.text = "Received"
        }
        
        self.valueLabel.text = "\(value) \(coinName)"
        self.valueHighlightLabel.text = "\(value) \(coinName)"
    }
    
    public override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
}
