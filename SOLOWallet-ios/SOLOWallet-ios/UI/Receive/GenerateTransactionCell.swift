//
//  GenerateTransactionCell.swift
//  SOLOWallet-ios
//
//  Created by Hoang Nguyen on 7/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

public class GenerateTransactionCell: UITableViewCell {
    @IBOutlet weak var addMoreButton: UIButton!
    @IBOutlet weak var generateButton: UIButton!
    
    public var delegate: SoloWalletDelegate?

    public override func awakeFromNib() {
        super.awakeFromNib()
        self.addMoreButton.tintColor = ThemeManager.shared.main
        self.addMoreButton.addTarget(self, action: #selector(self.addMoreButtonTapped), for: .touchUpInside)
        
        self.generateButton.layer.cornerRadius = 5
        self.generateButton.backgroundColor = ThemeManager.shared.main
        self.generateButton.tintColor = UIColor.white
        self.generateButton.addTarget(self, action: #selector(self.generateButtonTapped(_:)), for: .touchUpInside)
    }
    
    @IBAction func generateButtonTapped(_ sender: Any) {
        self.delegate?.request(SDKAction.generateReceiveQR.rawValue)
    }
    
    @IBAction func addMoreButtonTapped(_ sender: Any) {
        self.delegate?.request(SDKAction.addMore.rawValue)
    }
}
