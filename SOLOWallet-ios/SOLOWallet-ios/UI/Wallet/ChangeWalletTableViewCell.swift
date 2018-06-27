//
//  ChangeWalletTableViewCell.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/20/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

public class ChangeWalletTableViewCell: UITableViewCell {
    
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var addressLabel: UILabel!
    @IBOutlet weak var copyButton: UIButton!
    @IBOutlet weak var changeAddressButton: UIButton!
    @IBOutlet weak var changeAddressIcon: UIButton!
    
    public override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.nameLabel.textColor = ThemeManager.shared.font
        self.addressLabel.textColor = ThemeManager.shared.font
        self.copyButton.tintColor = ThemeManager.shared.disable
        self.copyButton.setImage(UIImage.init(named: "ic_copy_content"), for: .normal)
        self.changeAddressButton.tintColor = ThemeManager.shared.main
        self.changeAddressIcon.tintColor = ThemeManager.shared.disable
        self.changeAddressIcon.setImage(UIImage.init(named: "ic_sort_down"), for: .normal)
    }
    
    public func bindData(_ coin: CoinDTO){
        if let address = coin.addresses?.first {
            if let name = address.network {
                self.nameLabel.text = name
            }
            if let address = address.address {
                self.addressLabel.text = String(address)
            }
        }
    }
    
    public override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
}
