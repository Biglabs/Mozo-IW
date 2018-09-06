//
//  WalletApiManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/5/18.
//

import Foundation
import PromiseKit
import SwiftyJSON

public extension ApiManager {
    public func getUserProfile() -> Promise<UserProfileDTO> {
        return Promise { seal in
            let url = Configuration.BASE_URL + ""
            self.execute(.get, url: url)
                .done { json -> Void in
                    // JSON info
                    print(json)
                    let jobj = SwiftyJSON.JSON(json)
                    let userProfile = UserProfileDTO.init(json: jobj)
                    seal.fulfill(userProfile!)
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
    
    public func updateUserProfile(userProfile: UserProfileDTO) -> Promise<[String : Any]> {
        return Promise { seal in
            let url = Configuration.BASE_URL + ""
            self.execute(.get, url: url)
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
                    // UIApplication.shared.isNetworkActivityIndicatorVisible = false
            }
        }
    }
}
