//
//  WalletApiManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/5/18.
//

import Foundation
import PromiseKit
import SwiftyJSON

let USER_API_PATH = "/api/user-profile"
public extension ApiManager {
    public func getUserProfile() -> Promise<UserProfileDTO> {
        return Promise { seal in
            let url = Configuration.BASE_URL + USER_API_PATH
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
                    seal.reject(err)
                }
                .finally {
                    //                    UIApplication.shared.isNetworkActivityIndicatorVisible = false
            }
        }
    }
    
    public func updateUserProfile(userProfile: UserProfileDTO) -> Promise<UserProfileDTO> {
        return Promise { seal in
            let url = Configuration.BASE_URL + USER_API_PATH
            let param = userProfile.rawData()
            self.execute(.put, url: url, parameters: param)
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
                    // UIApplication.shared.isNetworkActivityIndicatorVisible = false
            }
        }
    }
    
    public func updateWalletToUserProfile(walletInfo: WalletInfoDTO) -> Promise<UserProfileDTO> {
        return Promise { seal in
            let url = Configuration.BASE_URL + USER_API_PATH + "/wallet"
            let param = walletInfo.rawData()
            self.execute(.put, url: url, parameters: param)
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
                    // UIApplication.shared.isNetworkActivityIndicatorVisible = false
            }
        }
    }
}
