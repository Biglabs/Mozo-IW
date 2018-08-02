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
    
    func createNewBtcTx(_ transaction: TransactionDTO, network: String, completion: @escaping (Any?, Error?) -> ()){
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.createNewBtcTransaction(transaction, network: network) { value, error in
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
    
    func sendBTC(_ signedTx: String, network: String, completion: @escaping (Any?, Error?) -> ()){
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.sendBtcTransaction(signedTx, network: network) { value, error in
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
