//
//  WaletListViewController.swift
//  SOLOWallet-ios
//
//  Created by Hoang Nguyen on 7/26/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SoloSDK
import MMDrawerController

class WalletListViewController: AbstractViewController {
    
    private var tableView: UITableView!
    private let refreshControl = UIRefreshControl()
    private var isLoadingAddresses = false
    
    internal var addresses: [AddressDTO] = []
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        self.buildMainView()
    }
    
    /// Update current address
    override func updateAddress(_ sender: Any? = nil) {
        self.tableView?.reloadData()
        self.isLoadingAddresses = false
    }
    
    func buildMainView() {
        self.createTitleView()
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(self.tap))
        tap.numberOfTapsRequired = 1
        tap.delegate = self
        self.view.addGestureRecognizer(tap)
        
        self.createTableView()
        self.createFooter()
        self.createManageBarButton()
    }
    
    func createTitleView() {
        let titleLabel = UILabel.init()
        titleLabel.font = UIFont.boldSystemFont(ofSize: 16)
        titleLabel.textColor = ThemeManager.shared.main
        titleLabel.text = "WALLET LIST"
        
        self.navigationItem.titleView = titleLabel
    }
    
    func createManageBarButton() {
        let barButton = UIBarButtonItem.init(title: "Manage", style: .plain, target: self, action: #selector(self.manageWallet(_:)))
        barButton.tintColor = ThemeManager.shared.main
        self.navigationItem.rightBarButtonItem = barButton
    }
    
    @objc func manageWallet(_ sender: Any? = nil) {
        self.soloSDK.singner?.manageWallet(){ result in
            switch result {
            case .success:
                // refresh address
                self.refresh()
            case .failure(let error):
                let alert = UIAlertController(title: error.title, message: error.detail, preferredStyle: .alert)
                alert.addAction(.init(title: "OK", style: .default, handler: nil))
                Utils.getTopViewController().present(alert, animated: true, completion: nil)
            }
        }
    }
    
    @objc func tap(gestureRecognizer: UITapGestureRecognizer) {
        let point = gestureRecognizer.location(in: self.view)
        
        if !self.tableView.point(inside: point, with: nil) {
            self.delegate?.request(EventType.Dismiss.rawValue)
        }
    }
    
    @objc func refresh(_ sender: Any? = nil) {
        self.delegate?.request(SDKAction.refreshAddress.rawValue)
        if let refreshControl = sender as? UIRefreshControl, refreshControl.isRefreshing {
            refreshControl.endRefreshing()
        }
    }
    
    func createTableView() {
        self.tableView = UITableView()
        self.tableView.frame = CGRect(x: self.view.bounds.origin.x, y: self.view.bounds.origin.y, width: self.view.bounds.size.width, height: self.view.bounds.size.height - 49)
        
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
    }
    
    func createFooter() {
        let footerView = UIView(frame: CGRect(x: 0, y: self.tableView.frame.size.height - 24, width: self.view.frame.size.width, height: 24))
        footerView.backgroundColor = .white
        
        // Image view
        let image = UIImage(named: "ic_moving_line")!
        let imageView = UIImageView(image: image)
        imageView.frame = CGRect(x: 0, y: 0, width: image.size.width, height: image.size.height)
        imageView.center.x = self.view.center.x // for horizontal
        
        let gesture = UIPanGestureRecognizer(target: self, action: #selector(self.handleMovingUp))
        imageView.isUserInteractionEnabled = true
        imageView.addGestureRecognizer(gesture)
        
        footerView.addSubview(imageView)
        self.view.addSubview(footerView)
    }
    
    @objc func handleMovingUp(gestureRecognizer: UIPanGestureRecognizer){
        print("gesture moving Up")
        if gestureRecognizer.state == UIGestureRecognizerState.began || gestureRecognizer.state == UIGestureRecognizerState.changed {
            let translation = gestureRecognizer.translation(in: self.view)
            print(self.view!.center.y)
            let limitPos = self.view.frame.size.height * 2 / 3
            if self.view!.center.y < limitPos {
                self.view!.center = CGPoint(x: self.view!.center.x, y: self.view!.center.y + translation.y)
            } else {
                self.view!.center = CGPoint(x: self.view!.center.x, y: limitPos)
            }
            gestureRecognizer.setTranslation(CGPoint(x: 0, y: 0), in: self.view)
        } else if gestureRecognizer.state == UIGestureRecognizerState.ended {
            self.delegate?.request(EventType.Dismiss.rawValue)
        }
    }
}

extension WalletListViewController: SoloWalletDelegate {
    func loadMoreTxHistory(_ blockHeight: Int64) {}
    
    func request(_ action: String) {}
    func updateCurrentAddress(_ address: AddressDTO) {}
    func updateAllAddresses(_ addresses: [AddressDTO]) {}
    func updateValue(_ key: String, value: String) {}
}

extension WalletListViewController: UIGestureRecognizerDelegate {
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
        if (touch.view?.isDescendant(of: self.tableView))! {
            print("Do not receive touch")
            return false
        }
        print("Receive touch")
        return true
    }
}

extension WalletListViewController: UITableViewDelegate, UITableViewDataSource {
    public func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.addresses.count
    }
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = self.tableView.dequeueReusableCell(withIdentifier: "CoinTableViewCell", for: indexPath) as! CoinTableViewCell
        if let coin = self.addresses.getElement(indexPath.row) {
            if coin.address == self.currentCoin?.address && coin.network == self.currentCoin?.network {
                coin.isCurrentAddress = true
            }
            cell.bindData(coin)
        }
        //            cell.delegate = self
        return cell
    }
    
    public func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        self.tableView.deselectRow(at: indexPath, animated: true)
        if let coin = self.addresses.getElement(indexPath.row) {
            if !coin.isCurrentAddress {
                self.currentCoin?.isCurrentAddress = false
                self.delegate?.updateCurrentAddress(coin)
            }
            self.delegate?.request(EventType.Dismiss.rawValue)
        }
    }
}
