//
//  TxCompletionViewController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation
import UIKit

class TxCompletionViewController: MozoBasicViewController {
    var eventHandler : TxCompletionModuleInterface?
    var detailItem: TxDetailDisplayItem!
    
    @IBOutlet weak var lbAmount: UILabel!
    @IBOutlet weak var lbAddress: UILabel!
    @IBOutlet weak var btnSave: UIButton!
    @IBOutlet weak var btnDetail: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setBtnLayer()
        updateView()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.title = ""
    }
    
    func updateView() {
        lbAddress.text = detailItem.addressTo
        lbAmount.text = "{\(detailItem.amount.convertOutputValue(decimal: detailItem.decimal))}"
    }
    
    func setBtnLayer() {
        btnSave.layer.borderWidth = 1
        btnSave.layer.borderColor = ThemeManager.shared.main.cgColor
        btnDetail.layer.borderWidth = 1
        btnDetail.layer.borderColor = ThemeManager.shared.main.cgColor
    }
    
    @IBAction func btnSaveTapped(_ sender: Any) {
        eventHandler?.requestAddToAddressBook(detailItem.addressTo)
    }
    
    @IBAction func btnDetailTapped(_ sender: Any) {
        eventHandler?.requestShowDetail(detailItem)
    }
}
extension TxCompletionViewController : TxCompletionViewInterface {
    func displayError(_ error: String) {
        displayMozoError(error)
    }
}
