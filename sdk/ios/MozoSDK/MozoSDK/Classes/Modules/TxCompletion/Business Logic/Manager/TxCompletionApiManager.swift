//
//  TxCompletionApiManager.swift
//  MozoSDK
//
//  Created by HoangNguyen on 10/7/18.
//

import Foundation
import PromiseKit
import SwiftyJSON

public extension ApiManager {
    /// Call API to get transaction status from a transaction hash.
    ///
    /// - Parameters:
    ///   - hash: the transaction hash
    public func getTxStatus(hash: String) -> Promise<[TxHistoryDTO]> {
        return Promise { seal in
            let url = Configuration.BASE_URL + TX_API_PATH + "txhistory/\(address)?page=\(page)&size=\(size)"
            self.execute(.get, url: url)
                .done { json -> Void in
                    // JSON info
                    print("Finish request to get list tx history, json response: \(json)")
                    let jobj = SwiftyJSON.JSON(json)["array"]
                    let list = TxHistoryDTO.arrayFromJson(jobj)
                    seal.fulfill(list)
                }
                .catch { error in
                    print("Error when request get list tx history: " + error.localizedDescription)
                    //Handle error or give feedback to the user
                    guard let err = error as? ConnectionError else {
                        if error is AFError {
                            return seal.fulfill([])
                        }
                        return seal.reject(error)
                    }
                    seal.reject(err)
                }
                .finally {
                    //                    UIApplication.shared.isNetworkActivityIndicatorVisible = false
            }
        }
    }
}
