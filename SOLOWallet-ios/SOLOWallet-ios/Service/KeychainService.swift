//
//  KeychainService.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/22/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import KeychainAccess

public struct KeychainKeys {
    public static let OAUTH_ACCESS_TOKEN = "OAUTH_ACCESS_TOKEN"
    public static let OAUTH_REFRESH_TOKEN = "OAUTH_REFRESH_TOKEN"
    public static let OAUTH_EXPIRES_IN = "OAUTH_EXPIRES_IN"
    public static let USER_NAME = "USER_NAME"
    public static let NETWORK_CODE = "NETWORK_CODE"
    public static let SKIP_NETWORK = "SKIP_NETWORK"
    public static let NETWORK_TOKENS = "NETWORK_TOKENS"
    public static let DEVICE_TOKEN = "DEVICE_TOKEN"
    
    //Launch Apps
    public static let ALWAYS_LAUNCH_SOLO_SIGNER_APP = "ALWAYS_LAUNCH_SOLO_SIGNER_APP"
    public static let ALWAYS_LAUNCH_SOLO_WALLET_APP = "ALWAYS_LAUNCH_SOLO_WALLET_APP"
}

public class KeychainService {
    let keychain = Keychain(service: Configuration.KEYCHAIN_SERVICE_NAME, accessGroup: Configuration.KEYCHAIN_ACCESS_GROUP_NAME)
    public static let instance = shared
    public static let shared = KeychainService()
    
    private init() { }
    
    public func getString(_ key: String) ->String?{
        do {
            let storedValue = try keychain.getString(key)
            return storedValue
        } catch let ex as NSError {
            print(ex.localizedDescription)
            return nil
        }
    }
    
    public func setString(_ key: String, value: String?){
        do {
            if value == nil {
                try keychain.remove(key)
            } else {
                try keychain.set(value!, key: key)
            }
        } catch let ex as NSError{
            print(ex.localizedDescription)
        }
    }
    
    
    public func getBool(_ key: String)->Bool{
        guard let storedValue = self.getString(key) else {
            return false
        }
        return storedValue.toBool ?? false
    }
    
    public func setBool(_ key: String, value: Bool?){
        do {
            if value == nil {
                try keychain.remove(key)
            } else {
                try keychain.set(value!.toString, key: key)
            }
        } catch let ex as NSError{
            print(ex.localizedDescription)
        }
    }
    
    
    public func getDictionary(_ key: String)->Dictionary<String, Any>?{
        do {
            guard let storedData = try keychain.getData(key) else {
                return nil
            }
            let decoded = try JSONSerialization.jsonObject(with: storedData, options: [])
            let dict = decoded as? [String:Any]
            return dict
        } catch let ex as NSError {
            print(ex.localizedDescription)
            return nil
        }
    }
    
    public func setDictionary(_ key: String, value: Dictionary<String, Any>?){
        do {
            if value == nil {
                try keychain.remove(key)
            } else {
                let data = try JSONSerialization.data(withJSONObject: value!, options: JSONSerialization.WritingOptions
                    .prettyPrinted)
                try keychain.set(data, key: key)
            }
        } catch let ex as NSError{
            print(ex.localizedDescription)
        }
    }
    
}
