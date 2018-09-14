//
//  AnonApiManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/11/18.
//

import Foundation
import PromiseKit
import SwiftyJSON

let ANONYMOUS_API_PATH = "/api/anonymous"
extension ApiManager {
    public func anonymousAuthenticate(anonymousUser: AnonymousUserDTO) -> Promise<AnonymousUserDTO?> {
        return Promise { seal in
            let url = Configuration.BASE_URL + ANONYMOUS_API_PATH
            let data = anonymousUser.rawData()
            self.execute(.post, url: url, parameters: data)
                .done { json -> Void in
                    // JSON info
                    print(json)
                    let jObj = SwiftyJSON.JSON(json)
                    let anonUser = AnonymousUserDTO.init(json: jObj)
                    seal.fulfill(anonUser)
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
