//
//  ReceiveViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

class ReceiveViewController: AbstractViewController {
    var tableView: UITableView?
    private let refreshControl = UIRefreshControl()
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
        self.tableView?.register(UINib.init(nibName: "ReceiveTransactionValueCell", bundle: nil), forCellReuseIdentifier: "ReceiveTransactionValueCell")
        self.tableView?.register(UINib.init(nibName: "GenerateTransactionCell", bundle: nil), forCellReuseIdentifier: "GenerateTransactionCell")
        
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
    
    @objc func refresh(_ sender: Any? = nil) {
        self.delegate?.request(SDKAction.getBalance.rawValue)
        if let refreshControl = sender as? UIRefreshControl, refreshControl.isRefreshing {
            refreshControl.endRefreshing()
        }
    }
    
    func displayQR(){
        
    }
    
    func addNewRow(){
        
    }
    
    func handleRequest(_ action: String){
        switch action {
        case SDKAction.generateReceiveQR.rawValue:
            self.displayQR()
        case SDKAction.addMore.rawValue:
            self.addNewRow()
        default:
            break;
        }
    }
}
extension ReceiveViewController: UITableViewDelegate, UITableViewDataSource {
    
    public func numberOfSections(in tableView: UITableView) -> Int {
        return 3
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
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
            let cell = self.tableView?.dequeueReusableCell(withIdentifier: "ReceiveTransactionValueCell", for: indexPath) as! ReceiveTransactionValueCell
            if let coin = self.currentCoin {
                cell.bindData(coin)
            }
            //            cell.delegate = self
            return cell
        } else {
            let cell = self.tableView?.dequeueReusableCell(withIdentifier: "GenerateTransactionCell", for: indexPath) as! GenerateTransactionCell
            cell.delegate = self
            return cell
        }
    }
    
    public func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
    }
}
extension ReceiveViewController: SoloWalletDelegate {
    func request(_ action: String) {
        self.handleRequest(action)
    }
    
    func loadMoreTxHistory(_ blockHeight: Int64) {}
    
    func updateValue(_ key: String, value: String) {}
}
