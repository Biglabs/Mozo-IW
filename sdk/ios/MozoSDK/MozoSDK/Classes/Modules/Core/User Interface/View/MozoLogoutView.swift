//
//  MozoLogoutView.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/26/18.
//

import UIKit

@IBDesignable class MozoLogoutView: MozoView {
    @IBOutlet weak var button: UIButton!
    
    override func identifier() -> String {
        return "MozoLogoutView"
    }
    
    override func checkDisable() {
        if AccessTokenManager.getAccessToken() != nil {
            isUserInteractionEnabled = true
            button.backgroundColor = ThemeManager.shared.main
        } else {
            isUserInteractionEnabled = false
            button.backgroundColor = ThemeManager.shared.disable
        }
    }
    
    override func loadViewFromNib() {
        super.loadViewFromNib()
        addUniqueAuthObserver()
    }
    
    @IBAction func tapped(_ sender: Any) {
        print("Tapped Mozo Button Logout")
        MozoSDK.logout()
    }
}
