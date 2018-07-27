//
//  InfoWalletTableViewCell.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/20/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

public class InfoWalletTableViewCell: UITableViewCell {
    
    @IBOutlet weak var refreshButton: UIButton!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var balanceLabel: UILabel!
    @IBOutlet weak var usdLabel: UILabel!
    @IBOutlet weak var qrcodeLabel: UILabel!
    @IBOutlet weak var qrcodeImageView: UIImageView!
    @IBOutlet weak var infoView: UIView!
    
    var delegate: SoloWalletDelegate?
    
    public override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.refreshButton.tintColor = ThemeManager.shared.disable
        self.refreshButton.setImage(UIImage.init(named: "ic_curved_arrows"), for: .normal)
        self.refreshButton.addTarget(self, action: #selector(self.refreshButtonTapped), for: .touchUpInside)
        self.nameLabel.textColor = ThemeManager.shared.highlight
        self.balanceLabel.textColor = ThemeManager.shared.main
        self.usdLabel.textColor = ThemeManager.shared.font
        self.qrcodeLabel.textColor = ThemeManager.shared.font
        self.qrcodeImageView.image = UIImage.init(named: "ic_qr_code")
        self.infoView.layer.cornerRadius = 5
        self.infoView.layer.borderWidth = 0.5
        self.infoView.layer.borderColor = ThemeManager.shared.border.cgColor
    }
    
    public func bindData(_ coin: AddressDTO){
        if let name = coin.coin {
            self.nameLabel.text = name
        }
        
        let balance = coin.balance ?? 0
        self.balanceLabel.text = String(balance)
        let usd = coin.usd ?? 0.0
        self.usdLabel.text = "\(Utils.roundDouble(usd*balance)) USD"
        
        if let code = coin.address {
            self.qrcodeImageView.image = Utils.generateQRCode(from: code)
        }
    }
    
    @objc func refreshButtonTapped() {
        self.delegate?.request(SDKAction.getBalance.rawValue)
    }
    
    public override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
}
