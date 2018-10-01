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
    
    public static func clearCurrentUser() {
        UserDefaults.standard.removeObject(forKey: Configuration.USER_INFO)
    }
    
    public static func loadAnonymousUUID() -> String? {
        return UserDefaults.standard.value(forKey: Configuration.USER_ID_ANONYMOUS) as? String
    }
    
    public static func saveAnonymousUUID(_ UUID: String?) {
        UserDefaults.standard.setValue(UUID, forKey: Configuration.USER_ID_ANONYMOUS)
    }
    
    public static var addressBookList : [AddressBookDTO] = []    
}
