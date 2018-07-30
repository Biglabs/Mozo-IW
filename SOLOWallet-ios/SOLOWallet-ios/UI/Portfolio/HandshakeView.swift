//
//  HandshakeView.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/28/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import Result
import SoloSDK
import JDStatusBarNotification

@IBDesignable
public class HandshakeView: UIView {
    var view: UIView!
    var soloSDK: SoloSDK!
    
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
        self.requestButton.tintColor = .white
        self.requestButton.addTarget(self, action: #selector(self.requestButtonTapped), for: .touchUpInside)
    }
    
    func _loadViewFromNib() ->UIView {
        let bundle = Bundle(for: type(of: self))
        let nib = UINib(nibName: "HandshakeView", bundle: bundle)
        let view  = nib.instantiate(withOwner: self, options: nil)[0] as! UIView
        
        return view
    }
    
    @objc func requestButtonTapped() {
        
        self.soloSDK.singner?.getWallet(){ result in
            switch result {
            case .success(let walletId):
                //Save walletId
                UserDefaults.standard.set(walletId, forKey: Configuration.WALLLET_ID)
                //refresh
                guard let appDelegate = UIApplication.shared.delegate as? AppDelegate,
                    let drawerController = appDelegate.drawerController else {return}
                drawerController.soloVC.initialize()
            case .failure(let error):
                let alert = UIAlertController(title: error.title, message: error.detail, preferredStyle: .alert)
                alert.addAction(.init(title: "OK", style: .default, handler: nil))
                Utils.getTopViewController().present(alert, animated: true, completion: nil)
            }
        }
    }
}
