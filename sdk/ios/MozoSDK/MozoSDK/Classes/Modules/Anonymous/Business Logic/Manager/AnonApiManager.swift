//
//  AnonApiManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/11/18.
//

import Foundation
import PromiseKit

extension ApiManager {
    public func anonymousAuthenticate(UUID: String) -> Promise<Any?> {
        return Promise { seal in
            let url = Configuration.BASE_URL + ""
            self.execute(.post, url: url)
                .done { json -> Void in
                    // JSON info
                    print(json)
                    seal.fulfill(json)
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
