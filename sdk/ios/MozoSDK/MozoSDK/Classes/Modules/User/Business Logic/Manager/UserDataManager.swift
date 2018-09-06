//
//  UserDataManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/6/18.
//

import Foundation

class UserDataManager : NSObject {
    var coreDataStore : CoreDataStore?
    
    /**
     Save an user to localDB.
     - Author:
     Hoang Nguyen
     
     - parameters:
     - user: The UserModel. Can not be empty.
     
     - Important:
     This code has gone through QA.
     
     - Version:
     0.1
     */
    func addNewUser(_ user: UserModel) {
        let newUser = coreDataStore?.newUser()
        newUser?.id = user.id!
        
        coreDataStore?.save()
    }
}
