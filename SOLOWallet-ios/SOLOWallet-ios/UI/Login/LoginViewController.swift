//
//  LoginViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/28/18.
//  Copyright © 2018 biglabs. All rights reserved.
//
import UIKit
import JDStatusBarNotification

class LoginViewController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var logoLabel: UILabel!
    @IBOutlet weak var usernameLabel: UILabel!
    @IBOutlet weak var passwordLabel: UILabel!
    @IBOutlet weak var usernameTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var forgotPasswordButton: UIButton!
    
    public var delegate: SoloWalletDelegate?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.loginButton.addTarget(self, action: #selector(self.loginButtonTapped), for: .touchUpInside)
    }
    
    @objc private func loginButtonTapped() {
        guard let username = self.usernameTextField.text, username != "" else {
            JDStatusBarNotification.show(withStatus: "Please input username.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
            return
        }
        KeychainService.shared.setString(KeychainKeys.USER_NAME, value: username)
        self.delegate?.request(SOLOACTION.Success.value)
        self.dismiss(animated: true, completion: nil)
    }
}
