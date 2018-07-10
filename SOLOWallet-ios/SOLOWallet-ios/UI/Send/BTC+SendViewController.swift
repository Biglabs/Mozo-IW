//
//  BTC+SendViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 7/4/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import JDStatusBarNotification
import SwiftyJSON
import SoloSDK

extension SendViewController {
    func validateBTC() -> Bool {
        return true
    }
    
    func createNewBtcTx(_ transaction: TransactionDTO, completion: @escaping (Any?, Error?) -> ()){
        //Convert value from ether to wei
        transaction.outputs?.forEach({ (output) in
            output.value = output.value! * 1E+8
        })
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.createNewBtcTransaction(transaction) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let connectionError = error {
                    Utils.showError(connectionError)
                }
                return
            }
            let json = SwiftyJSON.JSON(value)
            if let errors = json["errors"].array {
                JDStatusBarNotification.show(withStatus: errors[0].string, dismissAfter: notificationDismissAfter, styleName: JDStatusBarStyleError)
                return
            }
            completion(json, nil)
        }
    }
    
    func sendBTC(_ signedTx: String){
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.sendBtcTransaction(signedTx) { value, error in
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
            }
        }
    }
}
