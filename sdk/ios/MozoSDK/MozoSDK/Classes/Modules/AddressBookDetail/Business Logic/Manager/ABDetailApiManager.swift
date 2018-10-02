//
//  ABDetailApiManager.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation
import PromiseKit
import SwiftyJSON

public extension ApiManager {
    public func updateAddressBook(_ addressBook: AddressBookDTO, isCreateNew: Bool) -> Promise<AddressBookDTO?> {
        return Promise { seal in
            let url = Configuration.BASE_URL + ADR_BOOK_API_PATH
            let param = addressBook.toJSON()
            let method : HTTPMethod = isCreateNew ? .post : .put
            self.execute(method, url: url, parameters: param)
                .done { json -> Void in
                    // JSON info
                    print("Finish request to update address book, json response: \(json)")
                    let jobj = SwiftyJSON.JSON(json)
                    let addressBook = AddressBookDTO.init(json: jobj)
                    seal.fulfill(addressBook)
                }
                .catch { error in
                    //Handle error or give feedback to the user
                    let err = error as! ConnectionError
                    print(err.localizedDescription)
                    seal.reject(err)
                }
                .finally {
                    //                    UIApplication.shared.isNetworkActivityIndicatorVisible = false
            }
        }
    }
}
