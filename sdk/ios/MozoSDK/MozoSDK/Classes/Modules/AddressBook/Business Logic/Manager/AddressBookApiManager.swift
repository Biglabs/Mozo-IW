//
//  AddressBookApiManager.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation
import PromiseKit
import SwiftyJSON

let ADR_BOOK_API_PATH = "/api/contacts"
public extension ApiManager {
    public func getListAddressBook() -> Promise<[AddressBookDTO]> {
        return Promise { seal in
            let url = Configuration.BASE_URL + ADR_BOOK_API_PATH
            self.execute(.get, url: url)
                .done { json -> Void in
                    // JSON info
                    print("Finish request to get list address book, json response: \(json)")
                    let jobj = SwiftyJSON.JSON(json)["array"]
                    let list = AddressBookDTO.arrayFromJson(jobj)
                    seal.fulfill(list)
                }
                .catch { error in
                    print("Error when request get address book: " + error.localizedDescription)
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
