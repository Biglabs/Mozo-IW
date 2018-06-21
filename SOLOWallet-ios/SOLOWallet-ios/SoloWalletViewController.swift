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
        walletVC.tabBarItem = UITabBarItem.init(title: SOLOTAB.Wallet.value, image: UIImage.init(named: SOLOTAB.Wallet.icon), tag: 0)
        tabBars.append(walletVC)
        
        //Tab 2: Receive
        let receiveVC = ReceiveViewController()
        receiveVC.tabBarItem = UITabBarItem.init(title: SOLOTAB.Receive.value, image: UIImage.init(named: SOLOTAB.Receive.icon), tag: 1)
        tabBars.append(receiveVC)
        
        //Tab 3: Exchange
        let exchangeVC = ExchangeViewController()
        exchangeVC.tabBarItem = UITabBarItem.init(title: SOLOTAB.Exchange.value, image: UIImage.init(named: SOLOTAB.Exchange.icon), tag: 2)
        tabBars.append(exchangeVC)
        
        //Tab 4: Send
        let sendVC = SendViewController()
        sendVC.tabBarItem = UITabBarItem.init(title: SOLOTAB.Send.value, image: UIImage.init(named: SOLOTAB.Send.icon), tag: 3)
        tabBars.append(sendVC)
        
        self.viewControllers = tabBars
        self.selectedIndex = 0
        self.tabBar.clipsToBounds = true
        
        //top border
        let topBorder = CALayer()
        topBorder.frame = CGRect(x: 0.0, y: 0.0, width: view.frame.size.width, height: 0.5)
        topBorder.backgroundColor = ThemeManager.shared.border.cgColor
        self.tabBar.layer.addSublayer(topBorder)
        
        UIView.appearance(whenContainedInInstancesOf: [UITabBar.self]).tintColor = ThemeManager.shared.title
        self.tabBar.barTintColor = UIColor.white
        self.tabBar.tintColor = ThemeManager.shared.main
    }
}
