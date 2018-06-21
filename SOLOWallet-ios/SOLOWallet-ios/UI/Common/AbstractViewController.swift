//
//  AbstractViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SideMenu
import MMDrawerController

//dummy data
let transactions = [TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0),
                    TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0),
                    TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0),
                    TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0),
                    TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0),
                    TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0),
                    TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0)
]

public class AbstractViewController: UIViewController {
    fileprivate var logoBarButton: UIBarButtonItem!
    fileprivate var menuBarButton: UIBarButtonItem!
    var heightStatusBarFrame = CGFloat(0)
    var heightNavigationBar = CGFloat(44)
    
    var coin: CoinDTO!
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor = ThemeManager.shared.background
        
        //dummy data
        let address = AddressDTO.init(id: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", name: "Wallet BTC No.1", time: 1415637900, balance: 7.020020030, transactions: transactions as? [TransactionDTO])
        coin = CoinDTO.init(id: 0, key: "BTC", name: "BTC", icon: "ic_bitcoin", addesses: [address!])
        
        heightStatusBarFrame = UIApplication.shared.statusBarFrame.height
        let navigationBar: UINavigationBar = UINavigationBar(frame: CGRect(x: 0, y: heightStatusBarFrame, width: self.view.frame.width, height: heightNavigationBar))
        self.view.addSubview(navigationBar)
        
        self.menuBarButton = UIBarButtonItem.init(image: UIImage.init(named: "ic_menu"), style: .plain, target: self, action: #selector(self.rightDrawerButtonPress(_:)))
        self.logoBarButton = UIBarButtonItem.init(title: "Solo", style: .plain, target: self, action: nil)
        self.logoBarButton.tintColor = ThemeManager.shared.main
        
        let navItem = UINavigationItem(title: coin.name!)
        navItem.rightBarButtonItem = self.menuBarButton
        navItem.leftBarButtonItem = self.logoBarButton
        
        let titleLabel = UILabel.init()
        titleLabel.font = UIFont.boldSystemFont(ofSize: 16)
        titleLabel.textColor = ThemeManager.shared.title
        if let icon = self.coin.icon {
            titleLabel.addTextWithImage(text: " \(self.coin.name ?? "")", image: UIImage.init(named: icon)!, imageBehindText: false, keepPreviousText: false)
        }
        navItem.titleView = titleLabel
        navigationBar.setItems([navItem], animated: false)
        
        
        //effect relax
        let doubleTap = UITapGestureRecognizer(target: self, action: #selector(self.doubleTap))
        doubleTap.numberOfTapsRequired = 2
        self.view.addGestureRecognizer(doubleTap)
        
        let twoFingerDoubleTap = UITapGestureRecognizer(target: self, action: #selector(self.twoFingerDoubleTap))
        twoFingerDoubleTap.numberOfTapsRequired = 2
        twoFingerDoubleTap.numberOfTouchesRequired = 2
        self.view.addGestureRecognizer(twoFingerDoubleTap)
    }
    
    @objc open func menuButtonPress(_ sender: Any? = nil) {
        guard let menuVC = SideMenuManager.menuRightNavigationController else {
            return
        }
        menuVC.navigationBar.isTranslucent = false
        self.present(menuVC, animated: true, completion: nil)
    }
    
    @objc open func rightDrawerButtonPress(_ sender: Any? = nil) {
        self.mm_drawerController?.toggle(MMDrawerSide.right, animated: true, completion: nil)
    }
    
    @objc open func doubleTap(_ sender: Any? = nil) {
        self.mm_drawerController?.bouncePreview(for: MMDrawerSide.right) { _ in }
    }
    
    @objc open func twoFingerDoubleTap(_ sender: Any? = nil) {
        self.mm_drawerController?.bouncePreview(for: MMDrawerSide.right) { _ in }
    }
    
    open func refresh(_ sender: Any? = nil) {}
}
