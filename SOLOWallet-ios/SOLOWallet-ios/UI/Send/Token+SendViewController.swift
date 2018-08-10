//
//  Token+SendViewController.swift
//  SOLOWallet-ios
//
//  Created by Hoang Nguyen on 8/9/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import JDStatusBarNotification
import SwiftyJSON
import SoloSDK

extension SendViewController {
    func createNewTokenTx(_ transaction: TransactionDTO, network: String, contractAddress: String, completion: @escaping (Any?, Error?) -> ()){
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.createNewTokenTransaction(transaction, network: network, contractAddress: contractAddress) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            completion(value, error)
        }
    }
    
    func sendTokenTx(_ signedTx: String, network: String, contractAddress: String, completion: @escaping (Any?, Error?) -> ()){
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.sendTokenTransaction(signedTx, network: network, contractAddress: contractAddress) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            completion(value, error)
        }
    }
}
