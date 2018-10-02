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
    
    override func checkDisable() {
        if AccessTokenManager.getAccessToken() != nil {
            isUserInteractionEnabled = false
            button.backgroundColor = ThemeManager.shared.disable
        } else {
            isUserInteractionEnabled = true
            button.backgroundColor = ThemeManager.shared.main
        }
    }
    
    override func loadViewFromNib() {
        super.loadViewFromNib()
        addUniqueAuthObserver()
    }
    
    @IBAction func tapped(_ sender: Any) {
        print("Tapped Mozo Button Login")
        MozoSDK.authenticate()
    }
}
