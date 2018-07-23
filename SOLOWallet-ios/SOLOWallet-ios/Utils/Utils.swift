//
//  Utils.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/21/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import SoloSDK
import JDStatusBarNotification

let notificationDismissAfter: TimeInterval = 5

public class Utils {
    public static func convertCoinValue(coinType: String?, value: Double) -> NSNumber{
        var retValue = NSNumber(value: 0)
        if coinType == CoinType.ETH.key {
            //Convert value from ether to wei
            retValue = NSNumber(value: value * 1E+18)
        } else if coinType == CoinType.BTC.key {
            //Convert value from ether to satoshis
            retValue = NSNumber(value: value * 1E+8)
        }
        return retValue
    }
    
    public static func convertOutputValue(coinType: String?, value: NSNumber) -> Double{
        var retValue = Double(0)
        if coinType == CoinType.ETH.key {
            //Convert value from ether to wei
            retValue = Double(value) / 1E+18
        } else if coinType == CoinType.BTC.key {
            //Convert value from ether to satoshis
            retValue = Double(value) / 1E+8
        }
        return retValue
    }
    
    public static func generateQRCode(from string: String) -> UIImage? {
        let data = string.data(using: String.Encoding.ascii)
        
        if let filter = CIFilter(name: "CIQRCodeGenerator") {
            filter.setValue(data, forKey: "inputMessage")
            let transform = CGAffineTransform(scaleX: 3, y: 3)
            
            if let output = filter.outputImage?.transformed(by: transform) {
                return UIImage(ciImage: output)
            }
        }
        
        return UIImage.init(named: "ic_qr_code")
    }
    
    public static func convertInt64ToStringWithFormat(_ dateInt64: Int64, format: String) -> String{
        let date = Date(timeIntervalSince1970:Double(dateInt64))
        return Utils.convertDateToStringWithFormat(date, format: format)
    }
    
    public static func convertDateToStringWithFormat(_ date: Date, format: String) -> String{
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = format
        dateFormatter.timeZone = TimeZone.current
        let dateString:String = dateFormatter.string(from: date)
        return dateString
    }
    
    public static func showError(_ connectionError: Error) {
        switch connectionError {
        case ConnectionError.noInternetConnection:
            JDStatusBarNotification.show(withStatus: ConnectionError.noInternetConnection.localizedDescription, dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleDark)
        case ConnectionError.requestTimedOut:
            JDStatusBarNotification.show(withStatus: ConnectionError.requestNotFound.localizedDescription, dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleDark)
        case ConnectionError.requestNotFound:
            JDStatusBarNotification.show(withStatus: ConnectionError.requestNotFound.localizedDescription, dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
        case ConnectionError.authenticationRequired:
            JDStatusBarNotification.show(withStatus: ConnectionError.authenticationRequired.localizedDescription, dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
        case ConnectionError.network(let error):
            print("Error: \(error)")
        default:
            JDStatusBarNotification.show(withStatus: "Network Error.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
        }
    }
    
    public static func getTopViewController() -> UIViewController! {
        let appDelegate = UIApplication.shared.delegate
        if let window = appDelegate!.window { return window?.visibleViewController }
        return nil
    }
    
    public static func roundDouble(_ value: Double) -> Double{
        return round(1000*value)/1000
    }
}

