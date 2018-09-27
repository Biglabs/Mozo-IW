//
//  MozoBalanceView.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/18/18.
//

import Foundation

@IBDesignable class MozoBalanceView : MozoView {
    //MARK: Customizable from Interface Builder
    @IBInspectable public var showDetail: Bool = false {
        didSet {
            displayType = .Detail
            updateView()
        }
    }
    @IBInspectable public var showQrCode: Bool = false {
        didSet {
            displayType = .DetailWithQR
            updateView()
        }
    }
    var displayType: BalanceDisplayType = BalanceDisplayType.Normal
    
    override func identifier() -> String {
        return displayType.value
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        setBorder()
    }
    
    func setBorder() {
        layer.borderWidth = 0.5
        layer.borderColor = ThemeManager.shared.borderInside.cgColor
    }
    
    func updateData() {
        
    }
}
