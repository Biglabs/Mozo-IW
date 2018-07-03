//
//  DrawerMenuViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import MMDrawerController

class DrawerMenuViewController: UIViewController {
    
    private var tableView: UITableView!
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        self.title = "Menu"
        self.navigationController?.navigationBar.frame = CGRect.init(x: 0, y: 0, width: self.view.bounds.width, height: 44)
        self.view.backgroundColor = ThemeManager.shared.background
        
        let height = self.navigationController?.navigationBar.frame.size.height ?? 0 + UIApplication.shared.statusBarFrame.height
        self.tableView = UITableView()
        self.tableView.frame = CGRect.init(x: 0, y: height, width: self.view.bounds.width, height: self.view.bounds.height - height)
        self.tableView.backgroundColor = .white
        self.tableView.rowHeight = UITableViewAutomaticDimension
        self.tableView.estimatedRowHeight = 44.0
        self.tableView.separatorInset = UIEdgeInsets.zero
        self.tableView.separatorStyle = UITableViewCellSeparatorStyle.none
        self.tableView.dataSource = self
        self.tableView.delegate = self
        self.view.addSubview(self.tableView)
    }
}

extension DrawerMenuViewController: UITableViewDelegate, UITableViewDataSource {
    
    public func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell(style: UITableViewCellStyle.value1, reuseIdentifier: "Cell")
        cell.textLabel?.text = "test"
        cell.textLabel?.textColor = .red
        return cell
    }
    
    public func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        self.tableView.deselectRow(at: indexPath, animated: true)
        
    }
}
