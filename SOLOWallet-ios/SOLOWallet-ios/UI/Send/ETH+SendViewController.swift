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
import SoloSDK

extension SendViewController {
    func validateETH(value: String) -> Bool {
        //TODO: Check gas price || gas limit
        if value == "0" || (Double(value)! < 0.001) {
            JDStatusBarNotification.show(withStatus: "Amount is below the minimum (0.001 ETH)", dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
            return false
        }
        return true
    }
    
    func createNewEthTx(_ transaction: TransactionDTO, network: String, completion: @escaping (Any?, Error?) -> ()){
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.createNewEthTransaction(transaction, network: network) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let connectionError = error {
                    Utils.showError(connectionError)
                }
                return
            }
            let json = SwiftyJSON.JSON(value)
            if let errors = json["errors"].array {
                JDStatusBarNotification.show(withStatus: errors[0]["error"].string, dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
                return
            }
            completion(json, nil)
        }
    }
    
    func sendETH(_ signedTx: String, network: String, completion: @escaping (Any?, Error?) -> ()){
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.sendEthTransaction(signedTx, network: network) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let connectionError = error {
                    Utils.showError(connectionError)
                }
                return
            }
            completion(value, nil)
        }
    }
}
