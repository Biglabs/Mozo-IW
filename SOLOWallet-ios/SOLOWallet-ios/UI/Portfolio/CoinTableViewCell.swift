//
//  CoinTableViewCell.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/27/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SoloSDK

public class CoinTableViewCell: UITableViewCell {
    
    @IBOutlet weak var container: UIView!
    @IBOutlet weak var iconImage: UIImageView!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var border: UIView!
    @IBOutlet weak var leadConstraint: NSLayoutConstraint!
    @IBOutlet weak var activateView: UIView!
    @IBOutlet weak var activateLabel: UILabel!
    
    public override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.nameLabel.textColor = ThemeManager.shared.title
        self.activateLabel.textColor = ThemeManager.shared.title
        self.border.backgroundColor = ThemeManager.shared.border
    }
    
    public func bindData(_ address: AddressDTO){
        if let name = address.coin {
            self.iconImage.image = UIImage.init(named: "ic_\(name)")
            self.nameLabel.text = address.network ?? name
        }
        self.leadConstraint.constant = address.isChild ? 40 : 20
        
        self.activateView.isHidden = !address.isCurrentAddress
    }
    
    public override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
}
