//
//  Utils.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/21/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
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
    
    public static func showError(_ backendError: Error) {
        switch backendError {
        case BackendError.noInternetConnection:
            JDStatusBarNotification.show(withStatus: "No Internet Connection.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleDark)
        case BackendError.requestTimedOut:
            JDStatusBarNotification.show(withStatus: "The request timed out.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleDark)
        case BackendError.resourceNotFound:
            JDStatusBarNotification.show(withStatus: "Resource Not Found", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
        case BackendError.authenticationRequired:
            JDStatusBarNotification.show(withStatus: "Authentication Required", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
        default:
            JDStatusBarNotification.show(withStatus: "Network Error.", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
        }
    }
    
    public static func getTopViewController() -> UIViewController! {
        let appDelegate = UIApplication.shared.delegate
        if let window = appDelegate!.window { return window?.visibleViewController }
        return nil
    }
    
    public static func handshakeWithSigner() {
        let alertController = UIAlertController(title: "Config", message: "Handshake with signer.", preferredStyle: .alert)
        
        let actionOk = UIAlertAction(title: "Ok", style: .default) { (action:UIAlertAction) in
            AppService.shared.launchSignerApp(ACTIONTYPE.GET_WALLET.value, type: COINTYPE.ETH.key, transaction: nil)
        }
        
        let actionCancel = UIAlertAction(title: "Cancel", style: .cancel) { (action:UIAlertAction) in
            
        }
        
        alertController.addAction(actionOk)
        alertController.addAction(actionCancel)
        Utils.getTopViewController().present(alertController, animated: true, completion: nil)
    }
}

