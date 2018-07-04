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
    
    public static func convertInt64ToStringWithFormat(_ dateInt64: Int64, format: String) -> String{
        let date = Date(timeIntervalSince1970:Double(dateInt64) / 1000.0)
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

