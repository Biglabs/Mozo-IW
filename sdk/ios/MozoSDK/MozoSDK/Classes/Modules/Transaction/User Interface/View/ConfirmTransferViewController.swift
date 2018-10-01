//
//  ConfirmTransferViewController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation
import UIKit

class ConfirmTransferViewController: MozoBasicViewController {
    var eventHandler : TransactionModuleInterface?
    
    @IBOutlet weak var lbBalance: UILabel!
    @IBOutlet weak var lbExchange: UILabel!
    @IBOutlet weak var lbAddress: UILabel!
    @IBOutlet weak var lbAmountValue: UILabel!
    @IBOutlet weak var lbAmountValueExchange: UILabel!
    
    var spinnerView : UIView?
    var transaction : TransactionDTO?
    var tokenInfo: TokenInfoDTO?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        enableBackBarButton()
        updateView()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        // Fix issue: Title is not correct after showing alert
        self.title = "CONFIRMATION"
    }
    
    func updateView() {
        let balance = tokenInfo?.balance ?? 0
        let displayBalance = balance.convertOutputValue(decimal: tokenInfo?.decimals ?? 0)
        lbBalance.text = "\(displayBalance)"
        
        lbAddress.text = transaction?.outputs?.first?.addresses![0]
        lbAmountValue.text = "\((transaction?.outputs?.first?.value?.convertOutputValue(decimal: tokenInfo?.decimals ?? 0))!)"
    }
    
    @IBAction func btnSendTapped(_ sender: Any) {
        eventHandler?.sendConfirmTransaction(transaction!)
    }
}

extension ConfirmTransferViewController : ConfirmTransferViewInterface {
    func displaySpinner() {
        navigationItem.hidesBackButton = true
        spinnerView = UIView.init(frame: self.view.bounds)
        spinnerView?.backgroundColor = UIColor.init(red: 0.5, green: 0.5, blue: 0.5, alpha: 0.5)
        let ai = UIActivityIndicatorView.init(activityIndicatorStyle: .whiteLarge)
        ai.startAnimating()
        ai.center = (spinnerView?.center)!
        
        DispatchQueue.main.async {
            self.spinnerView?.addSubview(ai)
            self.view.addSubview(self.spinnerView!)
        }
    }
    
    func removeSpinner() {
        DispatchQueue.main.async {
            self.navigationItem.hidesBackButton = false
            self.spinnerView?.removeFromSuperview()
        }
    }
    
    func displayError(_ error: String) {
        displayMozoError(error)
    }
}
