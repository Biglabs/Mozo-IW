//
//  SigninView.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/26/18.
//

import Foundation
import UIKit
@IBDesignable class MozoSigninView: MozoView {
    @IBOutlet weak var button: UIButton!
    
    override func identifier() -> String {
        return "MozoSigninView"
    }
    
    @IBAction func tapped(_ sender: Any) {
        print("Tapped Mozo Button Login")
        MozoSDK.authenticate()
    }
}
