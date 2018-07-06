//
//  ETH+SendViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 7/4/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import JDStatusBarNotification
import SwiftyJSON

extension SendViewController {
    func validateETH(value: String) -> Bool {
        //TODO: Check gas price || gas limit
        if value == "0" || (Double(value)! < 0.001) {
            JDStatusBarNotification.show(withStatus: "Amount is below the minimum (0.001 ETH)", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
            return false
        }
        return true
    }
    
    func sendETH(_ signedTx: String){
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.sendEthTransaction(signedTx) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let connectionError = error {
                    Utils.showError(connectionError)
                }
                return
            }
            let json = SwiftyJSON.JSON(value)
            if let hash = json["tx"]["hash"].string {
                self.viewTransactionOnBrowser(hash)
                print("ETH transaction: ", hash)
            } else if let errMsg = json["errors"][0]["error"].string {
                print("ETH send transaction error: ", errMsg)
            }
        }
    }
}
