//
//  TxCompletionApiManager.swift
//  MozoSDK
//
//  Created by HoangNguyen on 10/7/18.
//

import Foundation
import PromiseKit
import SwiftyJSON

let TX_ETH_SOLO_API_PATH = "/api/eth/solo"
public extension ApiManager {
    /// Call API to get transaction status from a transaction hash.
    ///
    /// - Parameters:
    ///   - hash: the transaction hash
    public func getTxStatus(hash: String) -> Promise<TransactionStatusType> {
        return Promise { seal in
            let url = Configuration.BASE_URL + TX_ETH_SOLO_API_PATH + "/txs/\(hash)/status"
            self.execute(.get, url: url)
                .done { json -> Void in
                    // JSON info
                    print("Finish request to get tx status, json response: \(json)")
                    if let jobj = SwiftyJSON.JSON(json)["status"].string {
                        if let status = TransactionStatusType(rawValue: jobj) {
                            seal.fulfill(status)
                        }
                    }
                }
                .catch { error in
                    print("Error when request get tx status: " + error.localizedDescription)
                    seal.reject(error)
                }
                .finally {
                    //                    UIApplication.shared.isNetworkActivityIndicatorVisible = false
            }
        }
    }
}
