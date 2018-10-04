//
//  DemoCryptorViewController.swift
//  Shopper
//
//  Created by Hoang Nguyen on 10/4/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit
import RNCryptor

class DemoCryptorViewController: UIViewController {
    @IBOutlet weak var txtMessage: UITextView!
    @IBOutlet weak var txtResult: UITextView!
    @IBOutlet weak var txtPassword: UITextField!
    
    @IBAction func encrypt(_ sender: Any) {
        if let message = txtMessage.text, let pwd = txtPassword.text {
            let result = encrypt(message: message, key: pwd)
            txtResult.text = result
        }
    }
    @IBAction func decrypt(_ sender: Any) {
        if let message = txtMessage.text, let pwd = txtPassword.text {
            let result = decrypt(message: message, key: pwd)
            txtResult.text = result
        }
    }
    public func encrypt(message: String, key: String) -> String {
        let data: Data = message.data(using: .utf8)!
        let encryptedData = RNCryptor.encrypt(data: data, withPassword: key)
        let encryptedString : String = encryptedData.base64EncodedString() // getting base64encoded string of encrypted data.
        return encryptedString
    }
    
    public func decrypt(message: String, key: String) -> String {
        do  {
            let data: Data = Data(base64Encoded: message)! // Just get data from encrypted base64Encoded string.
            let decryptedData = try RNCryptor.decrypt(data: data, withPassword: key)
            let decryptedString = String(data: decryptedData, encoding: .utf8) // Getting original string, using same .utf8 encoding option,which we used for encryption.
            return decryptedString ?? ""
        }
        catch let error as Error {
            let alert = UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
            self.present(alert, animated: true, completion: nil)
            return ""
        }
    }
}
