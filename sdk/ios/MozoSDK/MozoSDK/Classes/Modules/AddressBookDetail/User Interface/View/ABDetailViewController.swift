//
//  ABDetailViewController.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation

class ABDetailViewController : MozoBasicViewController {
    var eventHandler : ABDetailModuleInterface?
    
    @IBOutlet var txtName : UITextField!
    @IBOutlet weak var txtAddress: UITextField!
    @IBOutlet weak var btnSave: UIButton!
    
    var transitioningBackgroundView : UIView = UIView()
    var address : String?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        enableBackBarButton()
        updateView()
    }
    
    func updateView() {
        txtAddress.text = address
    }
    
    @IBAction func save(_ sender: AnyObject) {
        if let text = txtName.text {
            let trim = text.trimmingCharacters(in: .whitespacesAndNewlines)
            if trim.isEmpty {
                displayMozoError("Name can not be empty")
                return
            }
            eventHandler?.saveAddressBookWithName(text, address: address!)
        } else {
            displayMozoError("Name can not be empty")
        }
    }
    
    @IBAction func endEditing(_ sender: Any) {
        // Check to enable button save
    }
    
    @IBAction func cancel(_ sender: AnyObject) {
        txtName.resignFirstResponder()
        eventHandler?.cancelSaveAction()
    }
}

extension ABDetailViewController: ABDetailViewInterface {
    func displaySpinner() {
        
    }
    
    func removeSpinner() {
        
    }
    
    func displayError(_ error: String) {
        displayError(error)
    }
}
