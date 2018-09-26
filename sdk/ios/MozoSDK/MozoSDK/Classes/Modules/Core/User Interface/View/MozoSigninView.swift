//
//  SigninView.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/26/18.
//

import Foundation
import UIKit
@IBDesignable class MozoSigninView: MozoView {
    @IBOutlet var containerView: UIView!
    @IBOutlet weak var button: UIButton!
    
    override func loadViewFromNib() {
        containerView = loadView(identifier: "MozoSigninView")
        addSubview(containerView)
    }
    
    @IBAction func tapped(_ sender: Any) {
        print("Tapped Mozo Button Login")
        MozoSDK.authenticate()
    }
}
