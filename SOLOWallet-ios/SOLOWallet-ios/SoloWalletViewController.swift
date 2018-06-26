//
//  SoloWalletViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import MMDrawerController

class SoloWalletViewController: UIViewController {
    
    let tabBarCtr = UITabBarController()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.createTitleView()
        self.createLogoBarButton()
        self.createMenuBarButton()
        
        //effect relax
        let doubleTap = UITapGestureRecognizer(target: self, action: #selector(self.doubleTap))
        doubleTap.numberOfTapsRequired = 2
        self.view.addGestureRecognizer(doubleTap)
        
        let twoFingerDoubleTap = UITapGestureRecognizer(target: self, action: #selector(self.twoFingerDoubleTap))
        twoFingerDoubleTap.numberOfTapsRequired = 2
        twoFingerDoubleTap.numberOfTouchesRequired = 2
        self.view.addGestureRecognizer(twoFingerDoubleTap)
        
        self.createTabBarController()
    }
    
    func createTitleView() {
        let titleLabel = UILabel.init()
        titleLabel.font = UIFont.boldSystemFont(ofSize: 16)
        titleLabel.textColor = ThemeManager.shared.title
        titleLabel.addTextWithImage(text: " ETH", image: UIImage.init(named: "ic_ethereum")!, imageBehindText: false, keepPreviousText: false)
        self.navigationItem.titleView = titleLabel
    }
    
    func createLogoBarButton() {
        let logoBarButton = UIBarButtonItem.init(title: "Solo", style: .plain, target: self, action: nil)
        logoBarButton.tintColor = ThemeManager.shared.main
        self.navigationItem.leftBarButtonItem = logoBarButton
    }
    
    func createMenuBarButton() {
        let menuBarButton = UIBarButtonItem.init(image: UIImage.init(named: "ic_menu"), style: .plain, target: self, action: #selector(self.rightDrawerButtonPress))
        self.navigationItem.rightBarButtonItem = menuBarButton
    }
    
    func createTabBarController() {
        var controllerArray: [UIViewController] = []
        
        //Tab 1: Wallet
        let walletVC = WalletViewController()
        walletVC.tabBarItem = UITabBarItem.init(title: SOLOTAB.Wallet.value, image: UIImage.init(named: SOLOTAB.Wallet.icon), tag: 0)
        controllerArray.append(walletVC)
        
        //Tab 2: Receive
        let receiveVC = ReceiveViewController()
        receiveVC.tabBarItem = UITabBarItem.init(title: SOLOTAB.Receive.value, image: UIImage.init(named: SOLOTAB.Receive.icon), tag: 1)
        controllerArray.append(receiveVC)
        
        //Tab 3: Exchange
        let exchangeVC = ExchangeViewController()
        exchangeVC.tabBarItem = UITabBarItem.init(title: SOLOTAB.Exchange.value, image: UIImage.init(named: SOLOTAB.Exchange.icon), tag: 2)
        controllerArray.append(exchangeVC)
        
        //Tab 4: Send
        let storyboard = UIStoryboard(name: "SendViewController", bundle: nil)
        let sendVC = storyboard.instantiateViewController(withIdentifier: "SendVC") as! SendViewController
        sendVC.tabBarItem = UITabBarItem.init(title: SOLOTAB.Send.value, image: UIImage.init(named: SOLOTAB.Send.icon), tag: 3)
        controllerArray.append(sendVC)
        
        self.tabBarCtr.viewControllers = controllerArray.map{ UINavigationController.init(rootViewController: $0)}
        
        self.view.addSubview(self.tabBarCtr.view)
    }
    
    @objc open func rightDrawerButtonPress(_ sender: Any? = nil) {
        self.mm_drawerController.toggle(MMDrawerSide.right, animated: true, completion: nil)
    }
    
    @objc open func doubleTap(_ sender: Any? = nil) {
        self.mm_drawerController?.bouncePreview(for: MMDrawerSide.right) { _ in }
    }
    
    @objc open func twoFingerDoubleTap(_ sender: Any? = nil) {
        self.mm_drawerController?.bouncePreview(for: MMDrawerSide.right) { _ in }
    }
}

extension MMDrawerController {
    var soloWalletVC: SoloWalletViewController! {
        return (self.centerViewController as? UINavigationController)?.rootViewController as? SoloWalletViewController
    }
    
    var drawerVC: DrawerMenuViewController! {
        return (self.leftDrawerViewController as? UINavigationController)?.rootViewController as? DrawerMenuViewController
    }
}
