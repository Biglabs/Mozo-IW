//
//  SoloWalletViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

public class SoloWalletViewController: UITabBarController, UITabBarControllerDelegate {
    public override func viewDidLoad() {
        super.viewDidLoad()
        UIApplication.shared.applicationIconBadgeNumber = 0
        
        self.initTabBar()
    }
    
    func initTabBar(){
        self.viewControllers?.removeAll()
        var tabBars: [UIViewController] = []
        
        //Tab 1: Wallet
        let walletVC = WalletViewController()
        walletVC.title = "Wallet"
        walletVC.tabBarItem = UITabBarItem.init(title: "Wallet", image: UIImage.init(named: "ic_wallet"), tag: 0)
        tabBars.append(walletVC)
        
        //Tab 2: Receive
        let receiveVC = ReceiveViewController()
        receiveVC.tabBarItem = UITabBarItem.init(title: "Receive", image: UIImage.init(named: "ic_down_arrow"), tag: 1)
        tabBars.append(receiveVC)
        
        //Tab 3: Exchange
        let exchangeVC = ExchangeViewController()
        exchangeVC.tabBarItem = UITabBarItem.init(title: "Exchange", image: UIImage.init(named: "ic_exchange_arrows"), tag: 2)
        tabBars.append(exchangeVC)
        
        //Tab 4: Send
        let sendVC = SendViewController()
        sendVC.tabBarItem = UITabBarItem.init(title: "Send", image: UIImage.init(named: "ic_up_arrow"), tag: 3)
        tabBars.append(sendVC)
        
        self.viewControllers = tabBars
        self.selectedIndex = 0
        self.tabBar.clipsToBounds = true
        
        //top border
        let topBorder = CALayer()
        topBorder.frame = CGRect(x: 0.0, y: 0.0, width: view.frame.size.width, height: 0.5)
        topBorder.backgroundColor = ThemeManager.shared.border.cgColor
        self.tabBar.layer.addSublayer(topBorder)
        
        UIView.appearance(whenContainedInInstancesOf: [UITabBar.self]).tintColor = ThemeManager.shared.font
        self.tabBar.barTintColor = UIColor.white
        self.tabBar.tintColor = ThemeManager.shared.main
    }
}
