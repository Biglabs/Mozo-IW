//
//  TransactionWalletTableViewCell.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/21/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SoloSDK

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
        self.dayLabel.textColor = .white
        self.monthLabel.textColor = .white
        self.timeView.layer.cornerRadius = 5
        self.timeView.backgroundColor = ThemeManager.shared.main
        self.typeLabel.textColor = ThemeManager.shared.font
        self.valueHighlightLabel.textColor = ThemeManager.shared.main
        self.valueLabel.textColor = ThemeManager.shared.font
        self.usdLabel.textColor = ThemeManager.shared.font
        self.borderBottom.backgroundColor = ThemeManager.shared.border
    }
    
    public func bindData(_ transaction: TransactionHistoryDTO, address: AddressDTO){
        if let time = transaction.time {
            self.dayLabel.text = Utils.convertInt64ToStringWithFormat(time, format: "dd")
            self.monthLabel.text = Utils.convertInt64ToStringWithFormat(time, format: "MMM")
        }
        
        if transaction.action == "SENT" {
            self.valueHighlightLabel.textColor = ThemeManager.shared.title
        }
        
        self.typeLabel.text = transaction.action?.lowercased().capitalizingFirstLetter()
        
        if transaction.confirmations! <  6 {
            self.typeLabel.addTextWithColor(text: " - Unconfirmed", color: .red)
        }
        var value = Double(0)
        if address.isChild {
            value = Utils.convertOutputValueForToken(value: transaction.amount!, decimal: (address.contract?.decimals)!)
        } else {
            value = Utils.convertOutputValue(coinType: address.coin, value: transaction.amount!)
        }
        self.valueLabel.text = "\(value) \(address.coin ?? "")"
        self.valueHighlightLabel.text = "\(value) \(address.coin ?? "")"
        
        self.usdLabel.text = "\(value*(address.usd ?? 0)) USD"
    }
    
    public override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
}
