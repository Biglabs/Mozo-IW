//
//  CoinTableViewCell.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/27/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

public class CoinTableViewCell: UITableViewCell {
    
    @IBOutlet weak var container: UIView!
    @IBOutlet weak var iconImage: UIImageView!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var border: UIView!
    @IBOutlet weak var leadConstraint: NSLayoutConstraint!
    
    
    public override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.nameLabel.textColor = ThemeManager.shared.font
        self.border.backgroundColor = ThemeManager.shared.border
    }
    
    public func bindData(_ address: AddressDTO){
        if let name = address.coin {
            self.iconImage.image = UIImage.init(named: "ic_\(name)")
            self.nameLabel.text = address.network ?? name
        }
        if address.isChild {
            self.leadConstraint.constant += 20
        }
    }
    
    public override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
}
