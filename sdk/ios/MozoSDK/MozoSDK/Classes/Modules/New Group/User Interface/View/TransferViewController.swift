//
//  TransferViewController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/18/18.
//

import Foundation
import UIKit

class TransferViewController: MozoBasicViewController {
    
    @IBOutlet weak var lbBalance: UILabel!
    @IBOutlet weak var lbExchange: UILabel!
    @IBOutlet weak var txtAddress: UITextField!
    @IBOutlet weak var btnAddressBook: UIButton!
    @IBOutlet weak var btnScan: UIButton!
    @IBOutlet weak var txtAmount: UITextField!
    @IBOutlet weak var lbSpendable: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setBtnLayer()
    }
    
    func setBtnLayer() {
        btnAddressBook.layer.borderWidth = 1
        btnAddressBook.layer.borderColor = ThemeManager.shared.main.cgColor
        btnScan.layer.borderWidth = 1
        btnScan.layer.borderColor = ThemeManager.shared.main.cgColor
    }
}
