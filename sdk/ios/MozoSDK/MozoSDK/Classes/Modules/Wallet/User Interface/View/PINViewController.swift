//
//  PINViewController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit

class PINViewController : MozoBasicViewController {
    @IBOutlet weak var checkView: UIView!
    @IBOutlet weak var pinTextField: PinTextField!
    @IBOutlet weak var enterPINLabel: UILabel!
    
    var eventHandler : WalletModuleInterface?
    var passPhrase : String?
    private var pin : String?
    private var isConfirm = false
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        configureView()
    }
    
    func configureView() {
        pinTextField.becomeFirstResponder()
        pinTextField.delegate = self as PinTextFieldDelegate
        pinTextField.keyboardType = .numberPad
        if self.passPhrase != nil {
            // Enter new pin and confirm new pin
            enterPINLabel.text = "ENTER YOUR SECURITY PIN TO RESTORE WALLET"
        }
    }
    
    override public var prefersStatusBarHidden: Bool {
        return false
    }
    
    override public var preferredStatusBarStyle: UIStatusBarStyle {
        return UIStatusBarStyle.lightContent
    }
}

extension PINViewController: PinTextFieldDelegate {
    func textFieldShouldBeginEditing(_ textField: PinTextField) -> Bool {
        return true
    }
    
    func textFieldDidBeginEditing(_ textField: PinTextField) {
        
    }
    
    func textFieldValueChanged(_ textField: PinTextField) {
        let value = textField.text ?? ""
        print("value changed: \(value)")
    }
    
    func textFieldShouldEndEditing(_ textField: PinTextField) -> Bool {
        return true
    }
    
    func textFieldShouldReturn(_ textField: PinTextField) -> Bool {
        return true
    }
}

extension PINViewController : PINViewInterface {
    func showCreatingInterface() {
        eventHandler?.manageWallet(passPhrase: passPhrase, pin: pin!)
        
        var activityIndicator = UIActivityIndicatorView()
        var strLabel = UILabel()
        
        let effectView = UIVisualEffectView(effect: UIBlurEffect(style: .dark))
        
//        strLabel.removeFromSuperview()
//        activityIndicator.removeFromSuperview()
//        effectView.removeFromSuperview()
        
        strLabel = UILabel(frame: CGRect(x: 40, y: 0, width: 180, height: 46))
        strLabel.text = "Creating Interfaces"
        strLabel.font = .systemFont(ofSize: 14)
        strLabel.textColor = UIColor(white: 0.9, alpha: 0.7)
        
        effectView.frame = CGRect(x: view.frame.midX - strLabel.frame.width/2, y: view.frame.midY - strLabel.frame.height/2 , width: 180, height: 46)
        effectView.layer.cornerRadius = 15
        effectView.layer.masksToBounds = true
        
        activityIndicator = UIActivityIndicatorView(activityIndicatorStyle: .white)
        activityIndicator.frame = CGRect(x: 0, y: 0, width: 46, height: 46)
        activityIndicator.startAnimating()
        
        effectView.contentView.addSubview(activityIndicator)
        effectView.contentView.addSubview(strLabel)
        view.addSubview(effectView)
    }
    
    func showVerificationFailed() {
        validationFail()
    }
    
    func showConfirmPIN() {
//        passwordContainerView.clearInput()
        enterPINLabel.text = "Confirm PIN"
        isConfirm = true
    }
}

//extension PINViewController: PasswordInputCompleteProtocol {
//    func passwordInputComplete(_ passwordContainerView: PasswordContainerView, input: String) {
//        if !isConfirm {
//            pin = input
//            if self.passPhrase != nil {
//                eventHandler?.enterPIN(pin: input)
//            } else {
//                eventHandler?.verifyPIN(pin: input)
//            }
//        } else {
//            eventHandler?.verifyConfirmPIN(pin: pin!, confirmPin: input)
//        }
//    }
//
//    func touchAuthenticationComplete(_ passwordContainerView: PasswordContainerView, success: Bool, error: Error?) {
//        if success {
//            self.validationSuccess()
//        } else {
//            passwordContainerView.clearInput()
//        }
//    }
//}

private extension PINViewController {
    func pinValidation(_ input: String) -> Bool {
        return true
    }
    
    func validation(_ input: String) -> Bool {
        return input == self.pin
    }
    
    func validationSuccess() {
        print("*️⃣ success!")
        
    }
    
    func validationFail() {
        print("*️⃣ failure!")
//        passwordContainerView.wrongPassword()
    }
}
