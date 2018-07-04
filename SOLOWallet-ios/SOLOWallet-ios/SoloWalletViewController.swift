//
//  SoloWalletViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SoloSDK
import SwiftyJSON

class SoloWalletViewController: UIViewController {
    
    let tabBarCtr = UITabBarController()
    var currentCoin: AddressDTO!
    var soloSDK: SoloSDK!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.createTabBarController()
        if self.currentCoin.coin == CoinType.ETH.key {
            //call getUSD() after have balance value
            self.getETHBalance()
        } else if self.currentCoin.coin == CoinType.BTC.key {
            self.getBTCBalance()
        } else {
            self.getUSD()
        }
        
    }
    
    func createTabBarController() {
        var controllerArray: [UIViewController] = []
        
        //Tab 1: Wallet
        let walletVC = WalletViewController()
        walletVC.currentCoin = self.currentCoin
        walletVC.soloSDK = self.soloSDK
        walletVC.delegate = self
        walletVC.tabBarItem = UITabBarItem.init(title: SoloTab.Wallet.value, image: UIImage.init(named: SoloTab.Wallet.icon), tag: 0)
        controllerArray.append(walletVC)
        
        //Tab 2: Receive
        let receiveVC = ReceiveViewController()
        receiveVC.tabBarItem = UITabBarItem.init(title: SoloTab.Receive.value, image: UIImage.init(named: SoloTab.Receive.icon), tag: 1)
        receiveVC.currentCoin = self.currentCoin
        receiveVC.soloSDK = self.soloSDK
        receiveVC.delegate = self
        controllerArray.append(receiveVC)
        
        //Tab 3: Exchange
        let exchangeVC = ExchangeViewController()
        exchangeVC.tabBarItem = UITabBarItem.init(title: SoloTab.Exchange.value, image: UIImage.init(named: SoloTab.Exchange.icon), tag: 2)
        exchangeVC.currentCoin = self.currentCoin
        exchangeVC.soloSDK = self.soloSDK
        exchangeVC.delegate = self
        controllerArray.append(exchangeVC)
        
        //Tab 4: Send
        let storyboard = UIStoryboard(name: "SendViewController", bundle: nil)
        let sendVC = storyboard.instantiateViewController(withIdentifier: "SendVC") as! SendViewController
        sendVC.tabBarItem = UITabBarItem.init(title: SoloTab.Send.value, image: UIImage.init(named: SoloTab.Send.icon), tag: 3)
        sendVC.currentCoin = self.currentCoin
        sendVC.soloSDK = self.soloSDK
        sendVC.delegate = self
        controllerArray.append(sendVC)
        
        self.tabBarCtr.viewControllers = controllerArray.map{ UINavigationController.init(rootViewController: $0)}
        
        self.view.addSubview(self.tabBarCtr.view)
    }
    
    func displayBalance( jsonStr : Any){
        let json = SwiftyJSON.JSON(jsonStr)
        var amount = 0.0
        
        if self.currentCoin.coin == CoinType.BTC.key {
            if let result = json["balance"].double {
                amount = result
                amount = amount/1E+8
            } else {return}
        } else if self.currentCoin.coin == CoinType.ETH.key {
            if let result = json["result"].string {
                amount = Double(result)!
                amount = amount/1E+18
            } else {return}
        }
        self.currentCoin?.balance = amount
        
        if let navWalletController = self.tabBarCtr.viewControllers?.getElement(0) as? UINavigationController {
            if let walletVC = navWalletController.topViewController as? WalletViewController {
                walletVC.currentCoin = self.currentCoin
            }
        }
        
        if let navSendController = self.tabBarCtr.viewControllers?.getElement(3) as? UINavigationController {
            if let sendVC = navSendController.topViewController as? SendViewController {
                sendVC.currentCoin = self.currentCoin
            }
        }
        self.getUSD()
    }
    
    func getBTCBalance(){
        guard let address = self.currentCoin.address else {
            return
        }
        self.soloSDK?.api?.getBalance(address) { (value, error) in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let backendError = error {
                    Utils.showError(backendError)
                }
                return
            }
            self.displayBalance(jsonStr: value)
        }
    }
    
    // call infura for demo only
    func getETHBalance() {
        guard let address = self.currentCoin.address else {
            return
        }
        
        let params = ["jsonrpc": "2.0", "id": 1, "method": "eth_getBalance", "params": [address,"latest"]] as [String : Any]
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.infuraPOST(params) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let backendError = error {
                    Utils.showError(backendError)
                }
                return
            }
            self.displayBalance(jsonStr: value)
        }
    }
    
    // call coinmarketcap for demo only
    func getUSD() {
        
        var id = 0
        if self.currentCoin.coin == CoinType.BTC.key {
            id = 1
        } else if self.currentCoin.coin == CoinType.ETH.key {
            id = 1027
        } else {
            return
        }
        
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.getTickerId("\(id)") { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let backendError = error {
                    Utils.showError(backendError)
                }
                return
            }
            
            let json = SwiftyJSON.JSON(value)
            if let price = json["data"]["quotes"]["USD"]["price"].double {
                self.currentCoin?.usd = price
                
                if let navWalletController = self.tabBarCtr.viewControllers?.getElement(0) as? UINavigationController {
                    if let walletVC = navWalletController.topViewController as? WalletViewController {
                        walletVC.currentCoin = self.currentCoin
                    }
                }
                
                if let navSendController = self.tabBarCtr.viewControllers?.getElement(3) as? UINavigationController {
                    if let sendVC = navSendController.topViewController as? SendViewController {
                        sendVC.currentCoin = self.currentCoin
                    }
                }
            }
        }
    }
}

extension SoloWalletViewController: SoloWalletDelegate {
    func request(_ action: String) {
        if action == CommandType.getBalance.rawValue {
            if self.currentCoin.coin == CoinType.ETH.key {
                self.getETHBalance()
            } else if self.currentCoin.coin == CoinType.BTC.key {
                self.getBTCBalance()
            }
        } else if action == EventType.Dismiss.rawValue {
            self.dismiss(animated: true)
        }
    }
    
    func updateValue(_ key: String, value: String) {}
}
