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
        
        if let balance = coin.balance {
            self.balanceLabel.text = String(balance)
        }
        if let code = coin.address {
            self.qrcodeImageView.image = self.generateQRCode(from: code)
        }
    }
    
    @objc func refreshButtonTapped() {
        self.delegate?.request(SOLOACTION.GetBalance.value)
    }
    
    func generateQRCode(from string: String) -> UIImage? {
        let data = string.data(using: String.Encoding.ascii)
        
        if let filter = CIFilter(name: "CIQRCodeGenerator") {
            filter.setValue(data, forKey: "inputMessage")
            let transform = CGAffineTransform(scaleX: 3, y: 3)
            
            if let output = filter.outputImage?.transformed(by: transform) {
                return UIImage(ciImage: output)
            }
        }
        
        return UIImage.init(named: "ic_qr_code")
    }
    
    public override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
}
