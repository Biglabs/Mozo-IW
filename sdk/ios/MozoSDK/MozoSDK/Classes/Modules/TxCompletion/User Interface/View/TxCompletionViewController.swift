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
        
    }
    
    @IBAction func btnDetailTapped(_ sender: Any) {
        eventHandler?.requestShowDetail(detailItem)
    }
}
