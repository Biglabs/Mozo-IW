//
//  HandshakeViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/27/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SwiftyJSON

class HandshakeViewController: UIViewController {
    @IBOutlet weak var walletIdLabel: UILabel!
    @IBOutlet weak var requestButton: UIButton!
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        self.requestButton.backgroundColor = ThemeManager.shared.main
        self.requestButton.layer.cornerRadius = 5
        self.requestButton.tintColor = UIColor.white
        self.requestButton.addTarget(self, action: #selector(self.requestButtonTapped), for: .touchUpInside)
    }
    
    @objc func requestButtonTapped() {
        //solosigner://{"action":"GET_WALLET","receiver":"com.hdwallet.solowallet"}
        AppService.shared.launchSignerApp(ACTIONTYPE.GET_WALLET.value, coinType: COINTYPE.ETH.key, transaction: nil)
    }
}
