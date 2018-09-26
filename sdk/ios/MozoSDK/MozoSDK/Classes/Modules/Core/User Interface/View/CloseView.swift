//
//  CloseView.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import UIKit

class CloseButton : UIButton {
    override func awakeFromNib() {
        super.awakeFromNib()
        self.frame = CGRect(x: self.frame.origin.x, y: self.frame.origin.y, width: 60, height: 24)
    }
}
