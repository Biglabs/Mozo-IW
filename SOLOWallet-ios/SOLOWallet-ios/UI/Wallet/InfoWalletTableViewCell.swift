//
//  InfoWalletTableViewCell.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/20/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

public class InfoWalletTableViewCell: UITableViewCell {
    
    @IBOutlet weak var curvedLabel: UIButton!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var balanceLabel: UILabel!
    @IBOutlet weak var usdLabel: UILabel!
    @IBOutlet weak var qrcodeLabel: UILabel!
    @IBOutlet weak var qrcodeImageView: UIImageView!
    @IBOutlet weak var infoView: UIView!
    
    public override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.curvedLabel.tintColor = ThemeManager.shared.disable
        self.curvedLabel.setImage(UIImage.init(named: "ic_curved_arrows"), for: .normal)
        self.nameLabel.textColor = ThemeManager.shared.highlight
        self.balanceLabel.textColor = ThemeManager.shared.main
        self.usdLabel.textColor = ThemeManager.shared.font
        self.qrcodeLabel.textColor = ThemeManager.shared.font
        self.qrcodeImageView.image = UIImage.init(named: "ic_qr_code")
        self.infoView.layer.cornerRadius = 5
        self.infoView.layer.borderWidth = 0.5
        self.infoView.layer.borderColor = ThemeManager.shared.border.cgColor
    }
    
    public func bindData(_ coin: CoinDTO){
        if let name = coin.name {
            self.nameLabel.text = name
        }
        
        if let address = coin.addresses?.first {
            if let balance = address.balance {
                self.balanceLabel.text = String(balance)
            }
        }
    }
    
    public override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
}
