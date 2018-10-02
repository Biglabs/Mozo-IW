//
//  TxHistoryApiManager.swift
//  MozoSDK
//
//  Created by HoangNguyen on 10/2/18.
//

import Foundation
import PromiseKit
import SwiftyJSON

public extension ApiManager {
    /// Call API to get all transaction histories from an address.
    ///
    /// - Parameters:
    ///   - address: the address
    ///   - completionHandler: handle after completed
    public func getListTxHistory(address: String, page: Int = 0, size: Int = 15) -> Promise<[TxHistoryDTO]> {
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
