//
//  SoloWalletViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SwiftyJSON

class SoloWalletViewController: UIViewController {
    
    let tabBarCtr = UITabBarController()
    var currentCoin: AddressDTO!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.createTitleView()
        self.createBackBarButton()
        
        self.getBalance()
    }
    
    func createTitleView() {
        if let name = self.currentCoin.coin {
            let titleLabel = UILabel.init()
            titleLabel.font = UIFont.boldSystemFont(ofSize: 16)
            titleLabel.textColor = ThemeManager.shared.title
            titleLabel.addTextWithImage(text: " \(name)", image: UIImage.init(named: "ic_\(name)")!, imageBehindText: false, keepPreviousText: false)
            self.navigationItem.titleView = titleLabel
        }
    }
    
    func createBackBarButton() {
        let logoBarButton = UIBarButtonItem.init(image: UIImage.init(named: "ic_left_arrow"), style: .plain, target: self, action: #selector(self.back))
        logoBarButton.tintColor = ThemeManager.shared.main
        self.navigationItem.leftBarButtonItem = logoBarButton
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
    
    // call infura for demo only
    func getBalance() {
        guard let address = self.currentCoin.address else {
            return
        }
        
        let params = ["jsonrpc": "2.0", "id": 1, "method": "eth_getBalance", "params": [address,"latest"]] as [String : Any]
        RESTService.shared.infuraPOST(params) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let backendError = error {
                    Utils.showError(backendError)
                }
                return
            }
            
            let json = SwiftyJSON.JSON(value)
            if let result = json["result"].string {
                var amount = Double(result)
                //ETH
                amount = amount!/1E+18
                self.currentCoin?.balance = amount ?? 0
                
                if let numViews = self.tabBarCtr.viewControllers?.count, numViews == 0 {
                    self.createTabBarController()
                } else {
                    if let walletVC: WalletViewController = self.tabBarCtr.viewControllers?.getElement(0) as? WalletViewController {
                        walletVC.currentCoin = self.currentCoin
                        walletVC.tableView.reloadData()
                    }
                    
                    if let sendVC: SendViewController = self.tabBarCtr.viewControllers?.getElement(3) as? SendViewController {
                        sendVC.currentCoin = self.currentCoin
                        sendVC.bindData()
                    }
                }
            }
        }
    }
    
    @objc func back() {
        self.dismiss(animated: true)
    }
}

extension SoloWalletViewController: SoloWalletDelegate {
    func request(_ action: String) {
        if action == SOLOACTION.GetBalance.value {
            self.getBalance()
        }
    }
    
    func updateValue(_ key: String, value: String) {
        
    }
}
