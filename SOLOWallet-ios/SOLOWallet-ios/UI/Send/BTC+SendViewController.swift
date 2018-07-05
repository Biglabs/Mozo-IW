//
//  BTC+SendViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 7/4/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SwiftyJSON

extension SendViewController {
    func validateBTC() -> Bool {
        return true
    }
    
    func sendBTC(_ signedTx: String){
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.sendTransaction(signedTx) { value, error in
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
