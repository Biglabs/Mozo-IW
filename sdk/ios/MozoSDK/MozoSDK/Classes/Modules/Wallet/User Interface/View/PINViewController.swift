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
    @IBOutlet weak var pinTextField: PinTextField!
    @IBOutlet weak var enterPINLabel: UILabel!
    @IBOutlet weak var descriptionLabel: UILabel!
    @IBOutlet weak var statusImg: UIImageView!
    @IBOutlet weak var statusLabel: UILabel!
    @IBOutlet weak var confirmImg: UIImageView!
    
    var eventHandler : WalletModuleInterface?
    var passPhrase : String?
    var moduleRequested: Module = .Wallet
    
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
        if self.passPhrase == nil {
            if moduleRequested == Module.Transaction {
                enterPINLabel.text = "ENTER YOUR SECURITY PIN"
                descriptionLabel.text = "Security PIN must be 6 di-git numbers"
                title = "SECURITY PIN CONFIRM"
            } else {
                // Enter new pin and confirm new pin
                enterPINLabel.text = "ENTER YOUR SECURITY PIN TO RESTORE WALLET"
            }
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
    
    func textFieldValueChanged(_ textField: PinTextField) {
        let value = textField.text ?? ""
        print("value changed: \(value)")
    }
    
    func textFieldShouldEndEditing(_ textField: PinTextField) -> Bool {
        return true
    }
    
    func textFieldDidEndEditing(_ textField: PinTextField) {
        pinInputComplete(input: textField.text!)
    }
    
    func textFieldShouldReturn(_ textField: PinTextField) -> Bool {
        return true
    }
}

extension PINViewController : PINViewInterface {
    func showCreatingInterface() {
        validationSuccess()
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + .milliseconds(900)) {
            self.hideAllUIs()
            self.showActivityIndicator()
        }
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + .seconds(1)) {
            self.eventHandler?.manageWallet(passPhrase: self.passPhrase, pin: self.pin!)
        }
    }
    
    func showVerificationFailed() {
        validationFail()
    }
    
    func showConfirmPIN() {
        pinTextField.text = ""
        enterPINLabel.text = "CONFIRM SECURITY PIN"
        descriptionLabel.text = "Re-enter your PIN"
        confirmImg.isHidden = false
        isConfirm = true
    }
    
    func displayError(_ error: String) {
        displayMozoError(error)
    }
    
    func displaySpinner() {
        displayMozoSpinner()
    }
    
    func removeSpinner() {
        removeMozoSpinner()
    }
    
    func displayTryAgain(_ error: String) {
        let alert = UIAlertController(title: "Error", message: error, preferredStyle: .alert)
        alert.addAction(.init(title: "Cancel", style: .default, handler: nil))
        alert.addAction(.init(title: "Try again", style: .default, handler: { (action) in
            print("User try manage wallet again.")
            self.eventHandler?.manageWallet(passPhrase: self.passPhrase, pin: self.pin!)
        }))
        self.present(alert, animated: true, completion: nil)
    }
}
private extension PINViewController {
    func hideAllUIs() {
        self.view.endEditing(true)
        view.subviews.forEach({ $0.isHidden = true })
    }
    
    func showActivityIndicator() {
        var activityIndicator = UIActivityIndicatorView()
        var strLabel = UILabel()
        
        let effectView = UIVisualEffectView(effect: UIBlurEffect(style: .regular))
        
        strLabel = UILabel(frame: CGRect(x: 10, y: 20, width: 140, height: 46))
        strLabel.text = "Creating Interfaces"
        strLabel.font = .systemFont(ofSize: 14)
        strLabel.textColor = ThemeManager.shared.main
        
        effectView.frame = CGRect(x: view.frame.midX - strLabel.frame.width/2, y: view.frame.midY - strLabel.frame.height, width: 140, height: 92)
        effectView.layer.cornerRadius = 15
        effectView.layer.masksToBounds = true
        
        activityIndicator = UIActivityIndicatorView(activityIndicatorStyle: .white)
        activityIndicator.color = ThemeManager.shared.main
        activityIndicator.frame = CGRect(x: 47, y: 0, width: 46, height: 46)
        activityIndicator.startAnimating()
        
        effectView.contentView.addSubview(activityIndicator)
        effectView.contentView.addSubview(strLabel)
        view.addSubview(effectView)
    }
    
    func pinInputComplete(input: String) {
        if !isConfirm {
            pin = input
            if self.passPhrase != nil {
                eventHandler?.enterPIN(pin: input)
            } else {
                // TODO: Should handle freeze UI here
                eventHandler?.verifyPIN(pin: input)
            }
        } else {
            eventHandler?.verifyConfirmPIN(pin: pin!, confirmPin: input)
        }
    }
    
    func validationSuccess() {
        print("😍 success!")
        statusImg.isHidden = false
        statusLabel.isHidden = false
        confirmImg.isHighlighted = true
        pinTextField.isUserInteractionEnabled = false
        if !isConfirm {
            statusLabel.text = "You entered a correct PIN"
        } else {
            statusLabel.text = "Create Security PIN successfully"
        }
        statusLabel.textColor = ThemeManager.shared.success
    }
    
    func validationFail() {
        print("😞 failure!")
        statusImg.isHidden = true
        statusLabel.isHidden = false
        statusLabel.text = "You entered an incorrect PIN"
        statusLabel.textColor = ThemeManager.shared.error
    }
}
