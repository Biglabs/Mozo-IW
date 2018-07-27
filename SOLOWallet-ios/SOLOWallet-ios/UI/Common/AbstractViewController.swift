//
//  AbstractViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SoloSDK
import SwiftyJSON

public class AbstractViewController: UIViewController {
    public var currentCoin = AddressDTO() {
        didSet {
            self.updateAddress()
        }
    }
    var soloSDK: SoloSDK!
    var delegate: SoloWalletDelegate?
    
    public override func viewDidLoad() {
        super.viewDidLoad()
//        self.view.backgroundColor = ThemeManager.shared.background
        
        self.hideKeyboardWhenTappedAround()
    }
    
    func hideKeyboardWhenTappedAround() {
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.dismissKeyboard))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }
    
    @objc func dismissKeyboard() {
        view.endEditing(true)
    }
    
    @objc func back() {
        self.delegate?.request(EventType.Dismiss.rawValue)
    }
    
    open func updateAddress(_ sender: Any? = nil) {}
}
