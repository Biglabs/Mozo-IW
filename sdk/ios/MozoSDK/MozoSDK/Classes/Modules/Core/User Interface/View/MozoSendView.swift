//
//  MozoSendView.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/26/18.
//

import UIKit

@IBDesignable class MozoSendView: MozoView {
    @IBOutlet weak var button: UIButton!
    
    override func identifier() -> String {
        return "MozoSendView"
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
    
    @IBAction func touchedUpInside(_ sender: Any) {
        print("Touched Up Inside Button Send Mozo")
        MozoSDK.transferMozo()
    }
}
