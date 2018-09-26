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
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        loadViewFromNib()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        loadViewFromNib()
    }
    
    override func prepareForInterfaceBuilder() {
        super.prepareForInterfaceBuilder()
        loadViewFromNib()
    }
    
    func loadViewFromNib() {
        containerView = loadView(identifier: "MozoSigninView")
        containerView.frame = bounds
        containerView.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        addSubview(containerView)
        
        checkDisable()
//        addTapAction()
    }
    
    func addTapAction() {
        let tap = UITapGestureRecognizer(target: self, action: #selector(self.tapped))
        tap.numberOfTapsRequired = 1
        button.isUserInteractionEnabled = true
        button.addGestureRecognizer(tap)
    }
    
    func checkDisable() {
        
    }
    
    @IBAction func tapped(_ sender: Any) {
        print("Tapped")
//        MozoSDK.authenticate()
    }
}
