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
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        initNib()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        initNib()
    }
    
    func initNib() {
        containerView = loadView(identifier: "MozoSendView")
        
        containerView.frame = bounds
        containerView.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        addSubview(containerView)
    }
    
    @IBAction func touchedUpInside(_ sender: Any) {
        print("touchedUpInside")
    }
}
