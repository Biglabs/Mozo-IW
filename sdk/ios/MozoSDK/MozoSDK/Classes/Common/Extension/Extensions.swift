//
//  Extensions.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit

public extension Bool {
    public var toString: String {
        let value = self
        return "\(value)"
    }
}

public extension String {
    public func isValidReceiveFormat() -> Bool{
        let regex = try? NSRegularExpression(pattern: "^[a-zA-Z]+:[a-zA-Z0-9]+\\?[a-zA-Z]+=[0-9.]*$", options: .caseInsensitive)
        return regex?.firstMatch(in: self, options: [], range: NSMakeRange(0, self.count)) != nil
    }
    
    public func isValidDecimalFormat() -> Bool{
        return Float(self) != nil
    }
    
    public func isValidDecimalMinValue(decimal: Int) -> Bool {
        let divisor = pow(10.0, Double(decimal))
        return Float(self)! >= Float(1 / divisor)
    }
    
    public func isValidName() -> Bool {
        let regex = try? NSRegularExpression(pattern: "^[a-zA-Z0-9_-]*$", options: .caseInsensitive)
        return regex?.firstMatch(in: self, options: [], range: NSMakeRange(0, self.count)) != nil
    }
    
    public func isValidEmail() -> Bool {
        let regex = try? NSRegularExpression(pattern: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$", options: .caseInsensitive)
        return regex?.firstMatch(in: self, options: [], range: NSMakeRange(0, self.count)) != nil
    }
    
    public var toBool: Bool? {
        let trueValues = ["true", "yes", "1"]
        let falseValues = ["false", "no", "0"]
        
        let lowerSelf = self.lowercased()
        
        if trueValues.contains(lowerSelf) {
            return true
        } else if falseValues.contains(lowerSelf) {
            return false
        } else {
            return nil
        }
    }
    
    public func replace(_ originalString:String, withString newString:String) -> String {
        let replaced =  self.replacingOccurrences(of: originalString, with: newString)
        return replaced
    }
    
    public func capitalizingFirstLetter() -> String {
        return prefix(1).uppercased() + dropFirst()
    }
    
    public func hasPrefix(_ prefix: String, caseSensitive: Bool) -> Bool {
        if !caseSensitive { return hasPrefix(prefix) }
        return self.lowercased().hasPrefix(prefix.lowercased())
    }
}

internal extension String {
    var hasOnlyNewlineSymbols: Bool {
        return trimmingCharacters(in: CharacterSet.newlines).isEmpty
    }
}

public extension Data {
    public var deviceToken: String {
        return self.reduce("", {$0 + String(format: "%02X", $1)})
    }
}

public extension UIViewController {
    public func isModal() -> Bool {
        if let navigationController = self.navigationController{
            if navigationController.viewControllers.first != self{
                return false
            }
        }
        
        if self.presentingViewController != nil {
            return true
        }
        
        if self.navigationController?.presentingViewController?.presentedViewController == self.navigationController  {
            return true
        }
        
        if self.tabBarController?.presentingViewController is UITabBarController {
            return true
        }
        
        return false
    }
}

extension UIColor {
    convenience init(hexString: String) {
        let hex = hexString.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int = UInt32()
        Scanner(string: hex).scanHexInt32(&int)
        let a, r, g, b: UInt32
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(red: CGFloat(r) / 255, green: CGFloat(g) / 255, blue: CGFloat(b) / 255, alpha: CGFloat(a) / 255)
    }
}

extension UIView {
    func roundCorners(corners:UIRectCorner, radius: CGFloat) {
        let path = UIBezierPath(roundedRect: self.bounds, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        let mask = CAShapeLayer()
        mask.path = path.cgPath
        self.layer.mask = mask
    }
}

extension Decimal {
    var toDouble:Double {
        return NSDecimalNumber(decimal:self).doubleValue
    }
}

public extension UIWindow {
    public var visibleViewController: UIViewController? {
        return UIWindow.getVisibleViewControllerFrom(self.rootViewController)
    }
    
    public static func getVisibleViewControllerFrom(_ vc: UIViewController?) -> UIViewController? {
        if let nc = vc as? UINavigationController {
            return UIWindow.getVisibleViewControllerFrom(nc.visibleViewController)
        } else if let tc = vc as? UITabBarController {
            return UIWindow.getVisibleViewControllerFrom(tc.selectedViewController)
        } else {
            if let pvc = vc?.presentedViewController {
                return UIWindow.getVisibleViewControllerFrom(pvc)
            } else {
                return vc
            }
        }
    }
}

extension UINavigationController {
    public var rootViewController : UIViewController? {
        return self.viewControllers.first
    }
}

public extension Array {
    //MARK: - using this method to avoid out of index
    public func getElement(_ index: Int) -> Element? {
        return (0 <= index && index < self.count ? self[index] : nil)
    }
}

internal extension Int {
    func times(f: () -> ()) {
        if self > 0 {
            for _ in 0..<self {
                f()
            }
        }
    }
    
    func times( f: @autoclosure () -> ()) {
        if self > 0 {
            for _ in 0..<self {
                f()
            }
        }
    }
}

public extension Double {
    func convertTokenValue(decimal: Int) -> NSNumber{
        let retValue = NSNumber(value: self * Double(truncating: pow(10, decimal) as NSNumber))
        return retValue
    }
    
    /// Rounds the double to decimal places value
    func rounded(toPlaces places:Int) -> Double {
        let divisor = pow(10.0, Double(places))
        return (self * divisor).rounded() / divisor
    }
}

public extension NSNumber {
    func convertOutputValue(decimal: Int) -> Double{
        let retValue = Double(truncating: self) / Double(truncating: pow(10, decimal) as NSNumber)
        return retValue
    }
}

extension Notification.Name {
    static let didAuthenticationSuccessWithMozo = Notification.Name("didAuthenticationSuccessWithMozo")
    static let didLogoutFromMozo = Notification.Name("didLogoutFromMozo")
    static let didChangeBalance = Notification.Name("didChangeBalance")
}
