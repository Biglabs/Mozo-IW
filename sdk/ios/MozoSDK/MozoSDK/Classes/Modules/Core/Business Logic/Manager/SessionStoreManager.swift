//
//  SessionStoreManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/6/18.
//

import Foundation

public class SessionStoreManager {
    public static func loadCurrentUser() -> UserDTO?{
        // Get User from UserDefaults
        if let userData = UserDefaults.standard.data(forKey: Configuration.USER_INFO),
            let user = try? JSONDecoder().decode(UserDTO.self, from: userData) {
            return user
        }
        print("Not found User Info")
        return nil
    }
    
    public static func saveCurrentUser(user: UserDTO) {
        if let encoded = try? JSONEncoder().encode(user) {
            UserDefaults.standard.set(encoded, forKey: Configuration.USER_INFO)
        }
    }
}
