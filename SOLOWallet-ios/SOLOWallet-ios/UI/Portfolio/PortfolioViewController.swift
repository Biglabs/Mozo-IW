//
//  PortfolioViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/27/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import MMDrawerController

class PortfolioViewController: UIViewController {
    
    private var tableView: UITableView!
    private let refreshControl = UIRefreshControl()
    
    internal var feed: AddressFeed?
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        if KeychainService.shared.getString(KeychainKeys.USER_NAME) == nil {
            self.login()
        } else {
            self.buildPortfolioView()
        }
    }
    
    func buildPortfolioView() {
        self.title = "Portfolio"
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
        
        self.validateHandshake()
    }
    
    func login(){
        let storyboard = UIStoryboard(name: "LoginViewController", bundle: nil)
        if let loginVC: LoginViewController = storyboard.instantiateViewController(withIdentifier: "LoginVC") as? LoginViewController {
            loginVC.delegate = self
            self.present(loginVC, animated: true)
        }
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
            self.tableView.reloadData()
            return
        }
        self.tableView.reloadData()
    }
    
    func validateHandshake() {
        if UserDefaults.standard.string(forKey: KeychainKeys.WALLLET_ID) == nil {
            let displayWidth: CGFloat = self.view.frame.width
            let displayHeight: CGFloat = self.view.frame.height
            let handShakeView = HandshakeView()
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
        self.view.subviews.forEach({ $0.removeFromSuperview() })
        
        let displayWidth: CGFloat = self.view.frame.width
        let displayHeight: CGFloat = self.view.frame.height
        
        self.tableView = UITableView(frame: CGRect(x: 0, y: 0, width: displayWidth, height: displayHeight))
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
        
        guard let walletId = UserDefaults.standard.string(forKey: KeychainKeys.WALLLET_ID) else {
            return
        }
        self.feed = AddressFeed.init(walletId)
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
        if let numAddr = self.feed?.addressess?.count {
            return numAddr
        }
        return 0
    }
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = self.tableView.dequeueReusableCell(withIdentifier: "CoinTableViewCell", for: indexPath) as! CoinTableViewCell
        if let coin = self.feed?.addressess?.getElement(indexPath.row) {
            cell.bindData(coin)
        }
        //            cell.delegate = self
        return cell
    }
    
    public func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        self.tableView.deselectRow(at: indexPath, animated: true)
        if let coin = self.feed?.addressess?.getElement(indexPath.row) {
            let soloWalletVC = SoloWalletViewController()
            soloWalletVC.currentCoin = coin
            Utils.getTopViewController().present(soloWalletVC, animated: true)
        }
    }
}

extension PortfolioViewController: SoloWalletDelegate {
    func request(_ action: String) {
        if action == SOLOACTION.Success.value {
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