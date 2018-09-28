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
        
    }
    
    @IBAction func touchedUpInside(_ sender: Any) {
        print("Touched Up Inside Button Send Mozo")
        MozoSDK.transferMozo()
    }
}
