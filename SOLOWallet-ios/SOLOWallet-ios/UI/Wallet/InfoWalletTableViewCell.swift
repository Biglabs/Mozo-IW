//
//  InfoWalletTableViewCell.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/20/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

public class InfoWalletTableViewCell: UITableViewCell {
    
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var addressLabel: UILabel!
    @IBOutlet weak var copyButton: UIButton!
    @IBOutlet weak var changeAddressButton: UIButton!
    
    public override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.nameLabel.textColor = ThemeManager.shared.font
        self.addressLabel.textColor = ThemeManager.shared.font
        self.copyButton.tintColor = ThemeManager.shared.font
        self.changeAddressButton.tintColor = ThemeManager.shared.main
    }
    
    public func bindData(_ coin: CoinDTO){
        if let address = coin.addesses?.first {
            if let name = address.name {
                self.nameLabel.text = name
            }
            if let address = address.id {
                self.addressLabel.text = String(address)
            }
        }
    }
    
    public override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
}
