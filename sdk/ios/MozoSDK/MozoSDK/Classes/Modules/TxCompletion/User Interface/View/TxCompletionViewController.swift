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
    @IBOutlet weak var txStatusLabel: UILabel!
    
    @IBOutlet weak var lbAmount: UILabel!
    @IBOutlet weak var lbAddress: UILabel!
    @IBOutlet weak var btnSave: UIButton!
    @IBOutlet weak var btnDetail: UIButton!
    @IBOutlet weak var btnReplaceDetail: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setBtnLayer()
        startSpinnerAnimation()
        updateView()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.title = ""
        checkAddressBook()
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
            btnReplaceDetail.isHidden = false
        }
    }
    
    func updateView() {
        txHashLabel.text = detailItem.hash
    }
    
    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        
    }
    
    func startSpinnerAnimation() {
        rotateView()
    }
    
    private func rotateView(duration: Double = 1.0) {
        UIView.animate(withDuration: duration, delay: 0.0, options: .curveLinear, animations: {
            self.txStatusImg.transform = self.txStatusImg.transform.rotated(by: CGFloat.pi)
        }) { finished in
            self.rotateView(duration: duration)
        }
    }
    
    func stopSpinnerAnimation() {
        txStatusImg.layer.removeAllAnimations()
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
}
