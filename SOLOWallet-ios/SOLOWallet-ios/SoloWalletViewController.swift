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
    /// All addresses of a specific network
    var addresses: [AddressDTO]!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.createTabBarController()
        
        self.getBalance()
        self.getTransactionHistories(blockHeight: nil)
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
    
    // MARK: Update UI
    
    func displayBalance( jsonStr : Any){
        let json = SwiftyJSON.JSON(jsonStr)
        var amount = 0.0
        
        if let result = json["balance"].double {
            amount = result
            amount = amount / (self.currentCoin.coin == CoinType.BTC.key ? 1E+8 : 1E+18)
        } else {return}

        self.currentCoin?.balance = amount
        
        self.resetCurrentCoinForAllChildren()
        
        self.getUSD()
    }
    
    func displayTH(jsonStr : Any){
        let json = SwiftyJSON.JSON(jsonStr)
        if let array = json.array {
            let moreTxs = array.filter({ TransactionHistoryDTO(json: $0) != nil }).map({ TransactionHistoryDTO(json: $0)! })
            self.currentCoin.transactions = (self.currentCoin.transactions ?? []) + moreTxs
            if (self.currentCoin.transactions?.count)! > 0 {
                self.resetCurrentCoinForAllChildren()
            }
        }
    }
    
    func resetCurrentCoinForAllChildren(){
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
    
    // MARK: Call APIs to get balance
    
    func getBalance(){
        switch self.currentCoin.coin {
        case CoinType.ETH.key:
            self.getETHBalance()
        case CoinType.BTC.key:
            self.getBTCBalance()
        default:
            self.getUSD()
        }
    }
    
    func getBTCBalance(){
        guard let address = self.currentCoin.address else {
            return
        }
        self.soloSDK?.api?.getBtcBalance(address) { (value, error) in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let connectionError = error {
                    Utils.showError(connectionError)
                }
                return
            }
            self.displayBalance(jsonStr: value)
        }
    }
    
    func getETHBalance() {
        guard let address = self.currentCoin.address else {
            return
        }
        
        self.soloSDK?.api?.getEthBalance(address) { (value, error) in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let connectionError = error {
                    Utils.showError(connectionError)
                }
                return
            }
            self.displayBalance(jsonStr: value)
        }
    }
    
    // MARK: Call APIs to get transaction history
    
    func getTransactionHistories(blockHeight: Int64?){
        switch self.currentCoin.coin {
        case CoinType.ETH.key:
            self.getEthTransactionHistories(blockHeight: blockHeight)
        case CoinType.BTC.key:
            self.getBtcTransactionHistories(blockHeight: blockHeight)
        default:
            break
        }
    }
    
    func getBtcTransactionHistories(blockHeight: Int64?){
        guard let address = self.currentCoin.address else {
            return
        }
        self.soloSDK?.api?.getBtcTransactionHistories(address, blockHeight: blockHeight) { (value, error) in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let connectionError = error {
                    Utils.showError(connectionError)
                }
                return
            }
            self.displayTH(jsonStr: value)
        }
    }
    
    func getEthTransactionHistories(blockHeight: Int64?){
        guard let address = self.currentCoin.address else {
            return
        }
        self.soloSDK?.api?.getEthTransactionHistories(address, blockHeight: blockHeight) { (value, error) in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let connectionError = error {
                    Utils.showError(connectionError)
                }
                return
            }
            self.displayTH(jsonStr: value)
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
                if let connectionError = error {
                    Utils.showError(connectionError)
                }
                return
            }
            
            let json = SwiftyJSON.JSON(value)
            if let price = json["data"]["quotes"]["USD"]["price"].double {
                self.currentCoin?.usd = price
                
                self.resetCurrentCoinForAllChildren()
            }
        }
    }
}

extension SoloWalletViewController: SoloWalletDelegate {
    func request(_ action: String) {
        switch action {
        case SDKAction.getBalance.rawValue:
            self.getBalance()
        case EventType.Dismiss.rawValue:
            self.dismiss(animated: true)
        default:
            break
        }
    }
    
    func loadMoreTxHistory(_ blockHeight: Int64){
        self.getTransactionHistories(blockHeight: blockHeight)
    }
    
    func updateValue(_ key: String, value: String) {}
}
