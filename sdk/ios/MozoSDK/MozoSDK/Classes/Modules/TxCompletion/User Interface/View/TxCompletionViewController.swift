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
    var transaction: IntermediaryTransactionDTO?
    var tokenInfo: TokenInfoDTO?
    
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
        lbAddress.text = transaction?.tx?.outputs?.first?.addresses![0]
        lbAmount.text = "{\((transaction?.tx?.outputs?.first?.value?.convertOutputValue(decimal: tokenInfo?.decimals ?? 0))!)}"
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
    }
}
