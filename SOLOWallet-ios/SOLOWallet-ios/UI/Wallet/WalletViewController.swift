//
//  WalletViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/20/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SwiftyJSON
import SoloSDK

class WalletViewController: AbstractViewController {
    var tableView: UITableView?
    private let refreshControl = UIRefreshControl()
    private var isLoadingMoreTH = false
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        self.tableView = UITableView()
        self.tableView?.frame = self.view.bounds
        self.tableView?.backgroundColor = .white
        self.tableView?.rowHeight = UITableViewAutomaticDimension
        self.tableView?.estimatedRowHeight = 44.0
        self.tableView?.separatorInset = UIEdgeInsets.zero
        self.tableView?.separatorStyle = UITableViewCellSeparatorStyle.none
        self.tableView?.allowsSelection = false
        
        self.tableView?.register(UINib.init(nibName: "ChangeWalletTableViewCell", bundle: nil), forCellReuseIdentifier: "ChangeWalletTableViewCell")
        self.tableView?.register(UINib.init(nibName: "InfoWalletTableViewCell", bundle: nil), forCellReuseIdentifier: "InfoWalletTableViewCell")
        self.tableView?.register(UINib.init(nibName: "MozoWalletTableViewCell", bundle: nil), forCellReuseIdentifier: "MozoWalletTableViewCell")
        self.tableView?.register(UINib.init(nibName: "TransactionWalletTableViewCell", bundle: nil), forCellReuseIdentifier: "TransactionWalletTableViewCell")
        
        self.tableView?.dataSource = self
        self.tableView?.delegate = self
        self.view.addSubview(self.tableView!)
        
        // Add Refresh Control to Table View
        if #available(iOS 10.0, *) {
            self.tableView?.refreshControl = refreshControl
        } else {
            self.tableView?.addSubview(refreshControl)
        }
        self.refreshControl.addTarget(self, action: #selector(self.refresh(_:)), for: .valueChanged)
    }
    
    override func updateAddress(_ sender: Any? = nil) {
        self.tableView?.reloadData()
        self.isLoadingMoreTH = false
    }
    
    @objc func refresh(_ sender: Any? = nil) {
        self.delegate?.request(SDKAction.getBalance.rawValue)
        self.delegate?.request(SDKAction.refreshTxHistory.rawValue)
        if let refreshControl = sender as? UIRefreshControl, refreshControl.isRefreshing {
            refreshControl.endRefreshing()
        }
    }
}

extension WalletViewController: UITableViewDelegate, UITableViewDataSource {
    
    public func numberOfSections(in tableView: UITableView) -> Int {
        if self.currentCoin?.coin == CoinType.MOZO.value {
            return 4
        }
        return 3
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if section >= 2 {
            if section == 2 && self.currentCoin?.coin?.compare(CoinType.MOZO.value) == ComparisonResult.orderedSame {
                return 1
            }
            return self.currentCoin?.transactions?.count ?? 0
        }
        return 1
    }
    
    public func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        if section == 2 && self.currentCoin?.coin == CoinType.MOZO.value {
            return 0
        }
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
            if section == 2 && self.currentCoin?.coin == CoinType.MOZO.value {
                return nil
            }
            label.text = "Transaction History"
        }
        view.addSubview(label)
        return view
    }

    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if indexPath.section == 0 {
            let cell = self.tableView?.dequeueReusableCell(withIdentifier: "ChangeWalletTableViewCell", for: indexPath) as! ChangeWalletTableViewCell
            if let coin = self.currentCoin {
                cell.bindData(coin)
            }
//            cell.delegate = self
            return cell
        } else if indexPath.section == 1 {
            let cell = self.tableView?.dequeueReusableCell(withIdentifier: "InfoWalletTableViewCell", for: indexPath) as! InfoWalletTableViewCell
            cell.delegate = self
            if let coin = self.currentCoin {
                cell.bindData(coin)
            }
            //            cell.delegate = self
            return cell
        } else {
            if indexPath.section == 2 && self.currentCoin?.coin?.compare(CoinType.MOZO.value) == ComparisonResult.orderedSame {
                let cell = self.tableView?.dequeueReusableCell(withIdentifier: "MozoWalletTableViewCell", for: indexPath) as! MozoWalletTableViewCell
                cell.delegate = self
                return cell
            } else {
                let cell = self.tableView?.dequeueReusableCell(withIdentifier: "TransactionWalletTableViewCell", for: indexPath) as! TransactionWalletTableViewCell
                
                if (self.currentCoin?.transactions?.count)! > 0, let trans = self.currentCoin?.transactions?[indexPath.row] {
                    cell.bindData(trans, address: self.currentCoin!)
                }
                //            cell.delegate = self
                return cell
            }
        }
    }
    
    public func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
    }
}

extension WalletViewController: UIScrollViewDelegate {
    func scrollViewDidEndDragging(_ scrollView: UIScrollView, willDecelerate decelerate: Bool) {
        //Bottom Refresh
        if scrollView == self.tableView {
            if ((scrollView.contentOffset.y + scrollView.frame.size.height) >= scrollView.contentSize.height) {
                if !self.isLoadingMoreTH && (self.currentCoin?.transactions != nil) && (self.currentCoin?.transactions?.count)! > 0 {
                    let blockHeight = (self.currentCoin?.transactions?.last?.blockHeight)!
                    print("Load more transaction histories with block height \(String(describing: blockHeight))")
                    self.isLoadingMoreTH = true
                    self.delegate?.loadMoreTxHistory(blockHeight)
                }
            }
        }
    }
}

extension WalletViewController: SoloWalletDelegate {
    func updateCurrentAddress(_ address: AddressDTO) {}
    func updateAllAddresses(_ addresses: [AddressDTO]) {}
    
    func request(_ action: String) {
        self.delegate?.request(action)
    }
    
    func loadMoreTxHistory(_ blockHeight: Int64) {
        self.delegate?.loadMoreTxHistory(blockHeight)
    }
    
    func updateValue(_ key: String, value: String) {}
}
