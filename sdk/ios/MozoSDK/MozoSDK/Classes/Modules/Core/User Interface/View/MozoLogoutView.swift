//
//  MozoLogoutView.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/26/18.
//

import UIKit

@IBDesignable class MozoLogoutView: MozoView {
    @IBOutlet var containerView: UIView!
    @IBOutlet weak var button: UIButton!
    
    override func loadViewFromNib() {
        containerView = loadView(identifier: "MozoLogoutView")
        addSubview(containerView)
    }
    
    @IBAction func tapped(_ sender: Any) {
        print("Tapped Mozo Button Logout")
        MozoSDK.logout()
    }
}
