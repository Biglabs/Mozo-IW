//
//  AbstractViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SwiftyJSON

public class AbstractViewController: UIViewController {
    public var currentCoin = AddressDTO() {
        didSet {
            self.updateAddress()
        }
    }
    var delegate: SoloWalletDelegate?
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor = ThemeManager.shared.background
        
        self.createTitleView()
        self.createBackBarButton()
    }
    
    func createTitleView() {
        if let name = self.currentCoin?.coin {
            let titleLabel = UILabel.init()
            titleLabel.font = UIFont.boldSystemFont(ofSize: 16)
            titleLabel.textColor = ThemeManager.shared.title
            titleLabel.addTextWithImage(text: " \(name)", image: UIImage.init(named: "ic_\(name)")!, imageBehindText: false, keepPreviousText: false)
            self.navigationController?.navigationBar.topItem?.titleView = titleLabel
        }
    }
    
    func createBackBarButton() {
        let backBarButton = UIBarButtonItem.init(image: UIImage.init(named: "ic_left_arrow"), style: .plain, target: self, action: #selector(self.back))
        backBarButton.tintColor = ThemeManager.shared.main
        self.navigationItem.leftBarButtonItem = backBarButton
    }
    
    @objc func back() {
        self.delegate?.request(SOLOACTION.Dismiss.rawValue)
    }
    
    open func updateAddress(_ sender: Any? = nil) {}
}
