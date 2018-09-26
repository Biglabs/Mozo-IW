//
//  MozoSendView.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/26/18.
//

import UIKit

@IBDesignable class MozoSendView: MozoView {
    @IBOutlet var containerView: UIView!
    @IBOutlet weak var button: UIButton!
    
    override func loadViewFromNib() {
        containerView = loadView(identifier: "MozoSendView")
        addSubview(containerView)
    }
    
    @IBAction func touchedUpInside(_ sender: Any) {
        print("Touched Up Inside Button Send Mozo")
        MozoSDK.transferMozo()
    }
}
