//
//  AuthDataManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/11/18.
//

import Foundation
import AppAuth

class AuthDataManager {
    public static func loadAuthState() -> OIDAuthState?{
        // Get User from UserDefaults
        if let data = UserDefaults.standard.data(forKey: Configuration.AUTH_STATE),
            let state = NSKeyedUnarchiver.unarchiveObject(with: data) as? OIDAuthState {
            return state
        }
        print("Not found Authn State")
        return nil
    }
    
    public static func saveAuthState(_ state: OIDAuthState?) {
        var data: Data? = nil
        if let authState = state {
            data = NSKeyedArchiver.archivedData(withRootObject: authState)
        }
        UserDefaults.standard.set(data, forKey: Configuration.AUTH_STATE)
    }
}
