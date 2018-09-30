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
    
    var transitioningBackgroundView : UIView = UIView()
    
    @IBAction func save(_ sender: AnyObject) {
        if let text = txtName.text {
            eventHandler?.detailSaveActionWithName(text, address: "")
        }
    }
    
    @IBAction func cancel(_ sender: AnyObject) {
        txtName.resignFirstResponder()
        eventHandler?.cancelSaveAction()
    }
}
