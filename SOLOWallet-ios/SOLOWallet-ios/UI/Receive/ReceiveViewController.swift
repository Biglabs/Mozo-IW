//
//  ReceiveViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SoloSDK
import SwiftyJSON

class ReceiveViewController: AbstractViewController {
    var tableView: UITableView?
    private let refreshControl = UIRefreshControl()
    private var coverView: UIView!
    private var popupView: UIView!
    private var imgView: UIImageView!
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
        
        self.initPopupView()
        
        // Add Refresh Control to Table View
        if #available(iOS 10.0, *) {
            self.tableView?.refreshControl = refreshControl
        } else {
            self.tableView?.addSubview(refreshControl)
        }
        self.refreshControl.addTarget(self, action: #selector(self.refresh(_:)), for: .valueChanged)
    }
    
    func initPopupView() {
        let displayWidth: CGFloat = self.view.frame.width
        let displayHeight: CGFloat = self.view.frame.height
        let viewFrame = CGRect(x: 0, y: 0, width: displayWidth, height: displayHeight)
        
        // cover view
        self.coverView = UIView(frame: viewFrame)
        self.coverView.backgroundColor = .black
        self.coverView.alpha = 0.5
        self.view.addSubview(coverView)
        self.coverView.isHidden = true
        
        // popup view
        let popupFrame = CGRect(x: 0, y: 0, width: 300, height: 350)
        self.popupView = UIView(frame: popupFrame)
        self.popupView.backgroundColor = .white
        self.popupView.center = self.view.center
        self.view.addSubview(self.popupView)
        self.popupView.isHidden = true

        // Image view
        let imgFrame = CGRect(x: 0, y: 0, width: 300, height: 300)
        self.imgView = UIImageView(frame: imgFrame)
        self.popupView.addSubview(imgView)
        
        // OK button
        let okayButtonFrame = CGRect(x: 100, y: 305, width: 100, height: 44)
        let okayButton = UIButton(frame: okayButtonFrame)
        okayButton.layer.cornerRadius = 5
        okayButton.backgroundColor = ThemeManager.shared.main
        okayButton.tintColor = .white
        okayButton.setTitle("OK", for: .normal)
        
        // here we are adding the button its superView
        self.popupView.addSubview(okayButton)
        okayButton.addTarget(self, action: #selector(self.closeQRScreen), for:.touchUpInside)
    }
    
    @objc func refresh(_ sender: Any? = nil) {
        self.delegate?.request(SDKAction.getBalance.rawValue)
        if let refreshControl = sender as? UIRefreshControl, refreshControl.isRefreshing {
            refreshControl.endRefreshing()
        }
    }
    
    func displayQR(transaction: TransactionDTO){
        self.popupView.isHidden = false
        self.coverView.isHidden = false
        if let trans = transaction.outputs?.first {
            var tx = (self.currentCoin?.coin?.lowercased())! + ":" + (trans.addresses?.first)!
            var value = Double(0)
            if self.currentCoin?.isChild == true {
                value = Utils.convertOutputValueForToken(value: trans.value!, decimal: (self.currentCoin?.contract?.decimals)!)
            } else {
                value = Utils.convertOutputValue(coinType: self.currentCoin?.coin, value: trans.value!)
            }
            tx += "?amount=" + String(value)
            self.imgView.image = Utils.generateQRCode(from: tx)
        }
    }
    
    func makeTx() -> TransactionDTO{
        let tx = TransactionDTO()!
        let length = self.tableView?.numberOfRows(inSection: 0) ?? 0
        for i in 0..<length {
            let output = OutputDTO()!
            // Section 0 -> Output Address
            let indexPathAddr = IndexPath(row: i, section: 0)
            if let cellAddr = self.tableView?.cellForRow(at: indexPathAddr) {
                let temp = cellAddr as! ChangeWalletTableViewCell
                output.addresses = [temp.addressLabel.text ?? ""]
            }
            // Section 1 -> Output value
            let indexPathValue = IndexPath(row: i, section: 1)
            if let cellValue = self.tableView?.cellForRow(at: indexPathValue) {
                let temp = cellValue as! ReceiveTransactionValueCell
                var value = 0.0
                if !(temp.inputCoinTextField.text?.isEmpty)! {
                    value = Double(temp.inputCoinTextField.text!)!
                }
                var txValue = NSNumber(value: 0)
                if self.currentCoin?.isChild == true {
                    txValue = value > 0.0 ? Utils.convertTokenValue(value: value, decimal: (self.currentCoin?.contract?.decimals)!) : 0
                } else {
                    txValue = value > 0.0 ? Utils.convertCoinValue(coinType: self.currentCoin?.coin, value: value) : 0
                }
                output.value = txValue
            }
            if let outputs = tx.outputs, outputs.count > 0 {
                tx.outputs?.append(output)
            } else {
                tx.outputs = [output]
            }
        }
        
        return tx
    }
    
    @objc func closeQRScreen(){
        self.popupView.isHidden = true
        self.coverView.isHidden = true
    }
    
    func addNewRow(){
        
    }
    
    func handleRequest(_ action: String){
        switch action {
        case SDKAction.generateReceiveQR.rawValue:
            let tx = self.makeTx()
            self.displayQR(transaction: tx)
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
    func updateCurrentAddress(_ address: AddressDTO) {}
    func updateAllAddresses(_ addresses: [AddressDTO]) {}
    func loadMoreTxHistory(_ blockHeight: Int64) {}
    
    func updateValue(_ key: String, value: String) {}
}
