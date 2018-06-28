//
//  HandshakeView.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/28/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

@IBDesignable
public class HandshakeView: UIView {
    var view: UIView!
    
    @IBOutlet weak var walletIdLabel: UILabel!
    @IBOutlet weak var requestButton: UIButton!
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        _setup()
    }
    
    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        _setup()
    }
    
    func _setup(){
        view = _loadViewFromNib()
        view.frame = bounds
        view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        addSubview(view)
        
        self.requestButton.backgroundColor = ThemeManager.shared.main
        self.requestButton.layer.cornerRadius = 5
        self.requestButton.tintColor = UIColor.white
        self.requestButton.addTarget(self, action: #selector(self.requestButtonTapped), for: .touchUpInside)
    }
    
    func _loadViewFromNib() ->UIView {
        let bundle = Bundle(for: type(of: self))
        let nib = UINib(nibName: "HandshakeView", bundle: bundle)
        let view  = nib.instantiate(withOwner: self, options: nil)[0] as! UIView
        
        return view
    }
    
    @objc func requestButtonTapped() {
        //solosigner://{"action":"GET_WALLET","receiver":"com.hdwallet.solowallet"}
        AppService.shared.launchSignerApp(WALLETACTION.GET_WALLET.rawValue, coinType: COINTYPE.ETH.key, transaction: nil)
    }
}
