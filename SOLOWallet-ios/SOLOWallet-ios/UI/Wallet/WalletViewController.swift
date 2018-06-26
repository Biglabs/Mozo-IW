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
    
    @objc override public func refresh(_ sender: Any? = nil) {
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        if let walletId = KeychainService.shared.getString(KeychainKeys.WALLLET_ID) {
            RESTService.shared.getAddresses(walletId) { value, error in
                UIApplication.shared.isNetworkActivityIndicatorVisible = false
                guard let value = value, error == nil else {
                    if let backendError = error {
                        Utils.showError(backendError)
                    }
                    self.refreshControl.endRefreshing()
                    return
                }
                
                let json = SwiftyJSON.JSON(value)
                var items = [AddressDTO]()
                if let arr = json.array {
                    items = arr.filter({ AddressDTO(json: $0) != nil }).map({ AddressDTO(json: $0)! })
                }
                DispatchQueue.main.async {
                    if items.count > 0 {
                        self.coin.addresses?.insert(items.first!, at: 0)
                    }
                    self.refreshControl.endRefreshing()
                    self.tableView.reloadData()
                }
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
            return self.coin.addresses?.first?.transactions?.count ?? 0
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
        
        let name = self.coin.name ?? ""
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
            cell.bindData(self.coin)
//            cell.delegate = self
            return cell
        } else if indexPath.section == 1 {
            let cell = self.tableView.dequeueReusableCell(withIdentifier: "InfoWalletTableViewCell", for: indexPath) as! InfoWalletTableViewCell
            cell.bindData(self.coin)
            //            cell.delegate = self
            return cell
        } else {
            let cell = self.tableView.dequeueReusableCell(withIdentifier: "TransactionWalletTableViewCell", for: indexPath) as! TransactionWalletTableViewCell
            if let trans = self.coin.addresses?.first?.transactions?[indexPath.row], let name = self.coin.name, let address = self.coin.addresses?.first?.id {
                cell.bindData(trans, coinName: name, address: address)
            }
            //            cell.delegate = self
            return cell
        }
    }
    
    public func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
    }
}
