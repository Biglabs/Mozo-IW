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
    
    @IBOutlet weak var txHashView: UIView!
    @IBOutlet weak var txHashLabel: UILabel!
    
    @IBOutlet weak var txCompletionView: UIView!
    @IBOutlet weak var txCpInfoLabel: UILabel!
    @IBOutlet weak var txCpAddressLabel: UILabel!
    
    @IBOutlet weak var txStatusView: UIView!
    @IBOutlet weak var txStatusImg: UIImageView!
    @IBOutlet weak var txStatusReplaceImg: UIImageView!
    @IBOutlet weak var txStatusLabel: UILabel!
    
    @IBOutlet weak var lbAmount: UILabel!
    @IBOutlet weak var lbAddress: UILabel!
    @IBOutlet weak var btnSave: UIButton!
    @IBOutlet weak var btnDetail: UIButton!
    @IBOutlet weak var btnReplaceDetail: UIButton!
    
    var stopWaiting = false
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setBtnLayer()
        startSpinnerAnimation()
        updateView()
        eventHandler?.requestWaitingForTxStatus(hash: detailItem.hash)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.title = ""
        checkAddressBook()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        if self.isMovingFromParentViewController {
            print("View controller was popped")
            eventHandler?.requestStopWaiting()
        }
    }
    
    func checkAddressBook() {
        print("Check address book")
        // Check address book
        // Verify address is existing in address book list or not
        let list = SessionStoreManager.addressBookList
        let contain = AddressBookDTO.arrayContainsItem(detailItem.addressTo, array: list)
        if contain {
            btnSave.isHidden = true
            btnDetail.isHidden = true
        }
        if stopWaiting {
            btnReplaceDetail.isHidden = false
        }
    }
    
    func checkTxStatus() {
        
    }
    
    func updateView() {
        txHashLabel.text = detailItem.hash
    }
    
    func startSpinnerAnimation() {
        rotateView()
    }
    
    private func rotateView(duration: Double = 1.0) {
        UIView.animate(withDuration: duration, delay: 0.0, options: .curveLinear, animations: {
            self.txStatusImg.transform = self.txStatusImg.transform.rotated(by: CGFloat.pi)
        }) { finished in
            if !self.stopWaiting {
                self.rotateView(duration: duration)
            } else {
                self.txStatusImg.transform = .identity
            }
        }
    }
    
    func stopSpinnerAnimation(completion: (() -> Swift.Void)? = nil) {
        self.stopWaiting = true
        txStatusImg.isHidden = true
        txStatusReplaceImg.isHidden = false
    }
    
    func setBtnLayer() {
        btnSave.layer.borderWidth = 1
        btnSave.layer.borderColor = ThemeManager.shared.main.cgColor
        btnDetail.layer.borderWidth = 1
        btnDetail.layer.borderColor = ThemeManager.shared.main.cgColor
        btnReplaceDetail.layer.borderWidth = 1
        btnReplaceDetail.layer.borderColor = ThemeManager.shared.main.cgColor
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
    
    func updateView(status: TransactionStatusType) {
        print("Update view with transaction status: \(status)")
        stopSpinnerAnimation()
        checkAddressBook()
        switch status {
        case .FAILED:
            txStatusReplaceImg.image = UIImage(named: "ic_failed", in: BundleManager.mozoBundle(), compatibleWith: nil)
        case .SUCCESS:
            txStatusReplaceImg.image = UIImage(named: "ic_check_success", in: BundleManager.mozoBundle(), compatibleWith: nil)
        default:
            break;
        }
        txStatusLabel.text = status.rawValue.lowercased().capitalizingFirstLetter()
    }
}
