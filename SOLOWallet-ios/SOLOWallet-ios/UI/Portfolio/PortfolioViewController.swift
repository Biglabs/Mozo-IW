//
//  PortfolioViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/27/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SoloSDK
import MMDrawerController

class PortfolioViewController: UIViewController {
    
    private var tableView: UITableView!
    private let refreshControl = UIRefreshControl()
    
    internal var feed: AddressFeed?
    var soloSDK: SoloSDK!
    internal var addresses: [AddressDTO] = []
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        self.buildPortfolioView()
    }
    
    func buildPortfolioView() {
        self.title = "Portfolio"
        self.createLogoBarButton()
        
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
    
    @objc func refresh(_ sender: Any? = nil) {
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
            //handle error screen
            self.tableView.reloadData()
            return
        }
        self.buildAddressList()
        self.tableView.reloadData()
        if self.feed?.zeroData == true {
            // handle no data
        }
    }
    
    func buildAddressList(){
        var networks = Set<String>()
        self.addresses = [AddressDTO]()
        self.feed?.addresses?.forEach({ (address) in
            if !networks.contains(address.network!) {
                networks.insert(address.network!)
                self.addresses.append(address)
            }
        })
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
            self.createTableView()
        }
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
    
    func createTableView() {
        self.createMenuBarButton()
        
        self.view.subviews.forEach({ $0.removeFromSuperview() })
        
        self.tableView = UITableView()
        self.tableView.frame = self.view.bounds
        self.tableView.backgroundColor = .white
        self.tableView.rowHeight = UITableViewAutomaticDimension
        self.tableView.estimatedRowHeight = 44.0
        self.tableView.separatorInset = UIEdgeInsets.zero
        self.tableView.separatorStyle = UITableViewCellSeparatorStyle.none
        
        self.tableView.register(UINib.init(nibName: "CoinTableViewCell", bundle: nil), forCellReuseIdentifier: "CoinTableViewCell")
        self.tableView.dataSource = self
        self.tableView.delegate = self
        self.view.addSubview(self.tableView)
        // Add Refresh Control to Table View
        if #available(iOS 10.0, *) {
            tableView.refreshControl = refreshControl
        } else {
            tableView.addSubview(refreshControl)
        }
        self.refreshControl.addTarget(self, action: #selector(self.refresh(_:)), for: .valueChanged)
        
        guard let walletId = UserDefaults.standard.string(forKey: Configuration.WALLLET_ID) else {
            return
        }
        self.feed = AddressFeed.init(walletId, soloSDK: self.soloSDK)
        self.refresh()
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

extension PortfolioViewController: UITableViewDelegate, UITableViewDataSource {
    
    public func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.addresses.count
    }
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = self.tableView.dequeueReusableCell(withIdentifier: "CoinTableViewCell", for: indexPath) as! CoinTableViewCell
        if let coin = self.addresses.getElement(indexPath.row) {
            cell.bindData(coin)
        }
        //            cell.delegate = self
        return cell
    }
    
    public func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        self.tableView.deselectRow(at: indexPath, animated: true)
        if let coin = self.addresses.getElement(indexPath.row) {
            let soloWalletVC = SoloWalletViewController()
            soloWalletVC.currentCoin = coin
            soloWalletVC.addresses = self.feed?.addresses?.filter({  $0.network == coin.network })
            soloWalletVC.soloSDK = self.soloSDK
            Utils.getTopViewController().present(soloWalletVC, animated: true)
        }
    }
}

extension PortfolioViewController: SoloWalletDelegate {
    func loadMoreTxHistory(_ blockHeight: Int64) {}
    
    func request(_ action: String) {
        if action == EventType.Success.rawValue {
            self.buildPortfolioView()
        }
    }
    
    func updateValue(_ key: String, value: String) {}
}

extension MMDrawerController {
    var portfolioVC: PortfolioViewController! {
        return (self.centerViewController as? UINavigationController)?.rootViewController as? PortfolioViewController
    }
    
    var drawerVC: DrawerMenuViewController! {
        return (self.leftDrawerViewController as? UINavigationController)?.rootViewController as? DrawerMenuViewController
    }
}
