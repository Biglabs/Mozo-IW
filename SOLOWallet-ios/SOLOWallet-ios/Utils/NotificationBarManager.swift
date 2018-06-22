//
//  NotificationBarManager.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/22/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import JDStatusBarNotification

let notificationDismissAfter: TimeInterval = 5

public class NotificationBarManager {
    
    public static func showError(_ backendError: Error) {
        switch backendError {
        case BackendError.noInternetConnection:
            JDStatusBarNotification.show(withStatus: "No Internet Connection", dismissAfter: notificationDismissAfter, styleName: "JDStatusBarStyleDark")
        default:
            JDStatusBarNotification.show(withStatus: "Network Error.", dismissAfter: notificationDismissAfter, styleName: "JDStatusBarStyleError")
        }
    }
}
