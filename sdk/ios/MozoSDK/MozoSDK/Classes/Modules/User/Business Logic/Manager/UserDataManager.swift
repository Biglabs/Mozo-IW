//
//  UserDataManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/6/18.
//

import Foundation
import PromiseKit

class UserDataManager : NSObject {
    var coreDataStore : CoreDataStore!
    
    /**
     Save an user to localDB synchronously.
     - Author:
     Hoang Nguyen
     
     - parameters:
     - user: The UserModel. Can not be empty.
     
     - Important:
     This code has gone through QA.
     
     - Version:
     0.1
     
     CoreData does no uniquing by itself. It has no notion of two entries being identical.
     To enable such a behavior we have to implement it ourself by doing a 'search before insert' aka a 'fetch before create'.
     */
    func addNewUser(_ user: UserModel) -> Bool {
        let count = coreDataStore.countById(user.id!)
        if count != nil && count! == 0 {
            return coreDataStore.addNewUser(userModel: user)
        }
        return true
    }
}
