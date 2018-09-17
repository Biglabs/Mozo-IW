//
//  AccessTokenManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/11/18.
//

import Foundation

public class AccessTokenManager {
    public static func loadToken() -> String? {
        if let token = UserDefaults.standard.string(forKey: Configuration.ACCESS_TOKEN) {
            return token
        }
        return UserDefaults.standard.string(forKey: Configuration.ACCESS_TOKEN_ANONYMOUS)
    }
    
    public static func getAccessToken() -> String? {
        return UserDefaults.standard.string(forKey: Configuration.ACCESS_TOKEN)
    }
    
    public static func saveToken(_ token: String?) {
        UserDefaults.standard.set(token, forKey: Configuration.ACCESS_TOKEN)
    }
    
    public static func clearToken() {
        UserDefaults.standard.removeObject(forKey: Configuration.ACCESS_TOKEN)
    }
    
    public static func saveAnonymousToken(_ token: String?) {
        UserDefaults.standard.set(token, forKey: Configuration.ACCESS_TOKEN_ANONYMOUS)
    }
}
