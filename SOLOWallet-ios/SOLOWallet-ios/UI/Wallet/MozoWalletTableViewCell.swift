//
//  MozoWalletTableViewCell.swift
//  SOLOWallet-ios
//
//  Created by Hoang Nguyen on 7/31/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

public class MozoWalletTableViewCell: UITableViewCell {
    @IBOutlet weak var btnBuy: UIButton!
    @IBOutlet weak var btnSell: UIButton!
    
    public var delegate: SoloWalletDelegate?
    
    public override func awakeFromNib() {
        super.awakeFromNib()
        self.btnBuy.layer.cornerRadius = 5
        self.btnBuy.tintColor = ThemeManager.shared.main
        self.btnBuy.tintColor = .white
        self.btnBuy.titleLabel?.font = UIFont.boldSystemFont(ofSize: 14)
        self.btnBuy.addTarget(self, action: #selector(self.btnBuyTapped), for: .touchUpInside)
        
        self.btnSell.layer.cornerRadius = 5
        self.btnSell.backgroundColor = ThemeManager.shared.main
        self.btnSell.tintColor = .white
        self.btnSell.titleLabel?.font = UIFont.boldSystemFont(ofSize: 14)
        self.btnSell.addTarget(self, action: #selector(self.btnSellTapped(_:)), for: .touchUpInside)
    }
    
    @IBAction func btnSellTapped(_ sender: Any) {
        
    }
    
    @IBAction func btnBuyTapped(_ sender: Any) {
        
    }
}
