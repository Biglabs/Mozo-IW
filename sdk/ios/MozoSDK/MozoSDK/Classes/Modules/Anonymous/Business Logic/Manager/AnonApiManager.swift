//
//  AnonApiManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/11/18.
//

import Foundation
import PromiseKit

let ANONYMOUS_API_PATH = "/api/"
extension ApiManager {
    public func anonymousAuthenticate(UUID: String) -> Promise<[String : Any?]> {
        return Promise { seal in
            let url = Configuration.BASE_URL + ANONYMOUS_API_PATH
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
    
    public func linkAnonymousUser(UUID: String, userId: String) -> Promise<[String : Any]> {
        let url = Configuration.BASE_URL + ANONYMOUS_API_PATH
        return self.execute(.post, url: url)
    }
}
