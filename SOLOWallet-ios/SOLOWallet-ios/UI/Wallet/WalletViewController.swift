//
//  WalletViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/20/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SwiftyJSON

class WalletViewController: AbstractViewController {
    private var tableView: UITableView!
    private let refreshControl = UIRefreshControl()
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        let displayWidth: CGFloat = self.view.frame.width
        let displayHeight: CGFloat = self.view.frame.height
        
        self.tableView = UITableView(frame: CGRect(x: 0, y: 0, width: displayWidth, height: displayHeight))
        self.tableView.backgroundColor = .white
        self.tableView.rowHeight = UITableViewAutomaticDimension
        self.tableView.estimatedRowHeight = 44.0
        self.tableView.separatorInset = UIEdgeInsets.zero
        self.tableView.separatorStyle = UITableViewCellSeparatorStyle.none
        self.tableView.allowsSelection = false
        
        self.tableView.register(UINib.init(nibName: "ChangeWalletTableViewCell", bundle: nil), forCellReuseIdentifier: "ChangeWalletTableViewCell")
        self.tableView.register(UINib.init(nibName: "InfoWalletTableViewCell", bundle: nil), forCellReuseIdentifier: "InfoWalletTableViewCell")
        self.tableView.register(UINib.init(nibName: "TransactionWalletTableViewCell", bundle: nil), forCellReuseIdentifier: "TransactionWalletTableViewCell")
        
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
    }
    
    @objc override func refresh(_ sender: Any? = nil) {
        super.refresh()
        self.feed.refresh(){ content, error in
            self.completion(error: error)
        }
        if let refreshControl = sender as? UIRefreshControl, refreshControl.isRefreshing {
            refreshControl.endRefreshing()
        }
    }
    
    func fetchAddresses(){
        self.feed.fetchContent() { content, error in
            self.completion(error: error)
        }
    }
    
    private func completion(error: Error?){
        guard error == nil else {
            self.tableView.reloadData()
            return
        }
        
        if let addressess = self.feed.addressess {
            for item in addressess {
                if item.coin == COINTYPE.ETH.key {
                    self.currentCoin = item
                    if let addr = item.address {
                        self.getBalance(addr)
                    }
                }
            }
        }
        self.tableView.reloadData()
    }
    
    // call infura for demo only
    func getBalance(_ address: String) {
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
                self.tableView.reloadData()
            }
        }
    }
}

extension WalletViewController: UITableViewDelegate, UITableViewDataSource {
    
    public func numberOfSections(in tableView: UITableView) -> Int {
        return 3
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if section == 2 {
            return self.currentCoin?.transactions?.count ?? 0
        }
        return 1
    }
    
    public func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 44
    }
    
    public func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let view = UIView(frame: CGRect(x: 0, y: 0, width: tableView.bounds.width, height: 44))
        view.backgroundColor = ThemeManager.shared.background
        let label = UILabel(frame: CGRect(x: 10, y: 10, width: tableView.bounds.width - 20, height: 34))
        label.font = UIFont.boldSystemFont(ofSize: 14)
        label.textColor = ThemeManager.shared.title
        
        let name = self.currentCoin?.coin ?? ""
        if section == 0 {
            label.text = name + " address"
        } else if section == 1 {
            label.text = "My " + name + " Wallet"
        } else {
            label.text = "Transaction History"
        }
        view.addSubview(label)
        return view
    }

    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if indexPath.section == 0 {
            let cell = self.tableView.dequeueReusableCell(withIdentifier: "ChangeWalletTableViewCell", for: indexPath) as! ChangeWalletTableViewCell
            if let coin = self.currentCoin {
                cell.bindData(coin)
            }
//            cell.delegate = self
            return cell
        } else if indexPath.section == 1 {
            let cell = self.tableView.dequeueReusableCell(withIdentifier: "InfoWalletTableViewCell", for: indexPath) as! InfoWalletTableViewCell
            if let coin = self.currentCoin {
                cell.bindData(coin)
            }
            //            cell.delegate = self
            return cell
        } else {
            let cell = self.tableView.dequeueReusableCell(withIdentifier: "TransactionWalletTableViewCell", for: indexPath) as! TransactionWalletTableViewCell
            if let trans = self.currentCoin?.transactions?[indexPath.row], let name = self.currentCoin?.coin, let address = self.currentCoin?.address {
                cell.bindData(trans, coinName: name, address: address)
            }
            //            cell.delegate = self
            return cell
        }
    }
    
    public func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
    }
}
