//
//  UITextField+Extension.swift
//  MozoSDK
//
//  Created by HoangNguyen on 10/7/18.
//

import Foundation

extension UITextField {
    func setBottomBorder() {
        self.borderStyle = .none
        self.layer.backgroundColor = UIColor.white.cgColor
        
        self.layer.masksToBounds = false
        self.layer.shadowColor = ThemeManager.shared.border.cgColor
        self.layer.shadowOffset = CGSize(width: 0.0, height: 1.0)
        self.layer.shadowOpacity = 1.0
        self.layer.shadowRadius = 0.0
    }
    
    func setBorderBottomLine(isError: Bool = false) {
        if isError {
            layer.shadowColor = ThemeManager.shared.error.cgColor
        } else {
            layer.shadowColor = ThemeManager.shared.border.cgColor
        }
    }
}
