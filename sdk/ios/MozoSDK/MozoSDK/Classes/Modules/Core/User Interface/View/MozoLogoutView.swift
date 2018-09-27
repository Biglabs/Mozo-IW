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
    
    @IBAction func tapped(_ sender: Any) {
        print("Tapped Mozo Button Logout")
        MozoSDK.logout()
    }
}
