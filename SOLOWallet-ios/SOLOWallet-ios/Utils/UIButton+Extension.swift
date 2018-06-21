//
//  UIButton+Extension.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/21/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

extension UIButton {
    func addImage(_ imageName: String, width: CGFloat = 20, top: CGFloat = 0, bottom: CGFloat = 0, right: CGFloat = 0) {
        self.setImage(UIImage(named: imageName), for: .normal)
        let left = self.frame.width - width - right
        self.imageEdgeInsets = UIEdgeInsets(top: top, left: left, bottom: bottom, right: right)
        self.titleEdgeInsets = UIEdgeInsets(top: 0, left: -(width+right), bottom: 0, right: (width+right))
    }
}
