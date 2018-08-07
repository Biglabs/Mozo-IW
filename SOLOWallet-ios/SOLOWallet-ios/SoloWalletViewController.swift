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
import MMDrawerController

class SoloWalletViewController: UIViewController {
    
    let tabBarCtr = UITabBarController()
    internal var feed: AddressFeed?
    var currentCoin: AddressDTO!
    var soloSDK: SoloSDK!
    /// All addresses
    var addresses: [AddressDTO]!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.buildCoverView()
    }
    
    func buildCoverView() {
        self.view.backgroundColor = .white
        //effect relax
        let doubleTap = UITapGestureRecognizer(target: self, action: #selector(self.doubleTap))
        doubleTap.numberOfTapsRequired = 2
        self.view.addGestureRecognizer(doubleTap)
        
        let twoFingerDoubleTap = UITapGestureRecognizer(target: self, action: #selector(self.twoFingerDoubleTap))
        twoFingerDoubleTap.numberOfTapsRequired = 2
        twoFingerDoubleTap.numberOfTouchesRequired = 2
        self.view.addGestureRecognizer(twoFingerDoubleTap)
        
        self.validateHandshake()
    }
    
    func validateHandshake() {
        if UserDefaults.standard.string(forKey: Configuration.WALLLET_ID) == nil {
            let displayWidth: CGFloat = self.view.frame.width
            let displayHeight: CGFloat = self.view.frame.height
            let handShakeView = HandshakeView()
            handShakeView.soloSDK = self.soloSDK
            handShakeView.frame = CGRect(x: 0, y: 0, width: displayWidth, height: displayHeight)
            self.view.addSubview(handShakeView)
        } else {
            self.initialize()
        }
    }
    
    func initialize() {
        guard let walletId = UserDefaults.standard.string(forKey: Configuration.WALLLET_ID) else {
            return
        }
        // TODO: Check connection status here
        
        self.feed = AddressFeed.init(walletId, soloSDK: self.soloSDK)
        self.refreshAddress()
    }
    
    @objc func refreshAddress(_ sender: Any? = nil) {
        self.feed?.refresh(){ content, error in
            self.completion(error: error)
        }
        if let refreshControl = sender as? UIRefreshControl, refreshControl.isRefreshing {
            refreshControl.endRefreshing()
        }
    }
    
    func fetchAddresses(){
        self.feed?.fetchContent() { content, error in
            self.completion(error: error)
        }
    }
    
    private func completion(error: Error?){
        guard error == nil else {
            // handle error screen
            
            return
        }
        if self.feed?.zeroData == true {
            // handle no data
            return
        }
        
        self.currentCoin = self.feed?.addresses?[1]
        self.getBalance()
        self.getTransactionHistories(blockHeight: nil)

        self.createTitleView()
        self.createSoloBarButton()
        self.createMenuBarButton()
        self.createTabBarController()
    }
    
    func createTitleView() {
        if let name = self.currentCoin?.coin {
            let titleLabel = UILabel.init()
            titleLabel.font = UIFont.boldSystemFont(ofSize: 16)
            titleLabel.textColor = ThemeManager.shared.title
            titleLabel.addTextWithImage(text: " \(name) ", image: UIImage.init(named: "ic_\(name)")!, imageBehindText: false, keepPreviousText: false)
            let downIcon = UIImage.init(named: "ic_sort_down")!
            titleLabel.addTextWithImage(text: "", image: downIcon, imageBehindText: true, keepPreviousText: true)
            
            let tap = UITapGestureRecognizer(target: self, action: #selector(self.tapTitle))
            tap.numberOfTapsRequired = 1
            titleLabel.isUserInteractionEnabled = true
            titleLabel.addGestureRecognizer(tap)
            
            self.navigationItem.titleView = titleLabel
        }
    }
    
    @objc open func tapTitle(_ sender: Any? = nil) {
        self.showWalletList()
    }
    
    func showWalletList(){
        let walletController = WalletListViewController()
        walletController.addresses = self.buildAddressList()
        walletController.currentCoin = self.currentCoin
        walletController.soloSDK = self.soloSDK
        walletController.delegate = self
        
        let nav = UINavigationController.init(rootViewController: walletController)
        nav.modalPresentationStyle = .overCurrentContext
        nav.modalTransitionStyle = .crossDissolve
        
        Utils.getTopViewController().present(nav, animated: true)
    }
    
    func buildAddressList() -> [AddressDTO]{
        var networks = Set<String>()
        var filterAddresses = [AddressDTO]()
        self.feed?.addresses?.forEach({ (address) in
            if !networks.contains(address.network!) {
                networks.insert(address.network!)
                filterAddresses.append(address)
                if address.coin == CoinType.ETH.key {
                    let child = AddressDTO()!
                    child.address = address.address
                    child.coin = CoinType.MOZO.key
                    child.network = address.network?.replace(address.coin!, withString: child.coin!)
                    child.isChild = true
                    child.transactions = []
                    filterAddresses.append(child)
                }
            }
        })
        return filterAddresses
    }
    
    func createSoloBarButton() {
        let logoBarButton = UIBarButtonItem.init(image: UIImage.init(named: "ic_SOLO_banner"), style: .plain, target: self, action: nil)
        logoBarButton.tintColor = ThemeManager.shared.main
        logoBarButton.imageInsets = UIEdgeInsets.init(top: 0, left: -20, bottom: 0, right: 0)
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
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let sendVC = storyboard.instantiateViewController(withIdentifier: "SendVC") as! SendViewController
        sendVC.tabBarItem = UITabBarItem.init(title: SoloTab.Send.value, image: UIImage.init(named: SoloTab.Send.icon), tag: 3)
        sendVC.currentCoin = self.currentCoin
        sendVC.soloSDK = self.soloSDK
        sendVC.delegate = self
        controllerArray.append(sendVC)
        
        self.tabBarCtr.viewControllers = controllerArray.map{ UINavigationController.init(rootViewController: $0)}
        
        self.view.addSubview(self.tabBarCtr.view)
    }
    
    // MARK: Animation
    
    @objc open func rightDrawerButtonPress(_ sender: Any? = nil) {
        self.mm_drawerController.toggle(MMDrawerSide.right, animated: true, completion: nil)
    }
    
    @objc open func doubleTap(_ sender: Any? = nil) {
        self.mm_drawerController?.bouncePreview(for: MMDrawerSide.right) { _ in }
    }
    
    @objc open func twoFingerDoubleTap(_ sender: Any? = nil) {
        self.mm_drawerController?.bouncePreview(for: MMDrawerSide.right) { _ in }
    }
    
    func dismissCurrentController(){
        if (Utils.getTopViewController() as? WalletListViewController) != nil{
            let transition: CATransition = CATransition()
            transition.duration = 0.3
            transition.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionLinear)
            transition.type = kCATransitionReveal
            transition.subtype = kCATransitionFromTop
            self.view.window!.layer.add(transition, forKey: nil)
        }
        self.dismiss(animated: true)
    }
    
    // MARK: Update UI
    
    func updateWalletList(){
        let walletController = Utils.getTopViewController() as! WalletListViewController
        walletController.addresses = self.buildAddressList()
        walletController.currentCoin = self.currentCoin
    }
    
    func displayBalance( jsonStr : Any){
        let json = SwiftyJSON.JSON(jsonStr)
        var amount = 0.0
        
        if let result = json["balance"].number {
            amount = Utils.convertOutputValue(coinType: self.currentCoin.coin, value: result)
        } else {return}

        self.currentCoin?.balance = amount
        
        self.resetCurrentCoinForAllChildren()
        
        self.getUSD()
    }
    
    func displayTH(jsonStr : Any, beginning: Bool){
        let json = SwiftyJSON.JSON(jsonStr)
        if let array = json.array {
            let txs = beginning ? [] : (self.currentCoin.transactions ?? [])
            let moreTxs = array.filter({ TransactionHistoryDTO(json: $0) != nil }).map({ TransactionHistoryDTO(json: $0)! })
            self.currentCoin.transactions = txs + moreTxs
            if (self.currentCoin.transactions?.count)! > 0 {
                self.resetCurrentCoinForAllChildren()
            } 
        }
    }
    
    func updateCurrentCoin(_ newCoin: AddressDTO){
        self.currentCoin = newCoin
        self.getBalance()
        self.createTitleView()
        self.resetCurrentCoinForAllChildren()
        if (self.currentCoin.transactions == nil) || self.currentCoin.transactions?.count == 0 {
            self.getTransactionHistories(blockHeight: nil)
        }
    }
    
    func resetCurrentCoinForAllChildren(){
        for viewController in self.tabBarCtr.viewControllers! {
            if let navController = viewController as? UINavigationController, let controller = navController.topViewController as? AbstractViewController {
                controller.currentCoin = self.currentCoin
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
        case CoinType.MOZO.key:
            self.getTokenBalance()
        default:
            self.getUSD()
        }
    }
    
    func getBTCBalance(){
        guard let address = self.currentCoin.address else {
            return
        }
        self.soloSDK?.api?.getBtcBalance(address, network: self.currentCoin.network!) { (value, error) in
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
        
        self.soloSDK?.api?.getEthBalance(address, network: self.currentCoin.network!) { (value, error) in
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
    
    func getTokenBalance(){
        guard let address = self.currentCoin.address else {
            return
        }
        self.soloSDK?.api?.getTokenBalance(address, network: self.currentCoin.network!, symbol: CoinType.MOZO.value) { (value, error) in
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
        self.soloSDK?.api?.getBtcTransactionHistories(address, network: self.currentCoin.network!, blockHeight: blockHeight) { (value, error) in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let connectionError = error {
                    Utils.showError(connectionError)
                }
                return
            }
            let beginning = blockHeight == nil
            self.displayTH(jsonStr: value, beginning: beginning)
        }
    }
    
    func getEthTransactionHistories(blockHeight: Int64?){
        guard let address = self.currentCoin.address else {
            return
        }
        self.soloSDK?.api?.getEthTransactionHistories(address, network: self.currentCoin.network!, blockHeight: blockHeight) { (value, error) in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let connectionError = error {
                    Utils.showError(connectionError)
                }
                return
            }
            let beginning = blockHeight == nil
            self.displayTH(jsonStr: value, beginning: beginning)
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
    func updateCurrentAddress(_ address: AddressDTO) {
        self.updateCurrentCoin(address)
    }
    
    func updateAllAddresses(_ addresses: [AddressDTO]) {
        
    }
    
    func request(_ action: String) {
        switch action {
        case SDKAction.getBalance.rawValue:
            self.getBalance()
        case SDKAction.refreshAddress.rawValue:
            self.feed?.fetchContent(){ content, error in
                self.completion(error: error)
                self.updateWalletList()
            }
        case SDKAction.refreshTxHistory.rawValue:
            self.getTransactionHistories(blockHeight: nil)
        case EventType.Dismiss.rawValue:
            self.dismissCurrentController()
        default:
            break
        }
    }
    
    func loadMoreTxHistory(_ blockHeight: Int64){
        self.getTransactionHistories(blockHeight: blockHeight)
    }
    
    func updateValue(_ key: String, value: String) {}
}

extension MMDrawerController {
    var soloVC: SoloWalletViewController! {
        return (self.centerViewController as? UINavigationController)?.rootViewController as? SoloWalletViewController
    }
    
    var drawerVC: DrawerMenuViewController! {
        return (self.leftDrawerViewController as? UINavigationController)?.rootViewController as? DrawerMenuViewController
    }
}
