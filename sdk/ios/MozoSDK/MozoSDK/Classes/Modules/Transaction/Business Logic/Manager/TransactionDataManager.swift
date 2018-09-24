//
//  TransactionDataManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/19/18.
//

import Foundation
import PromiseKit

class TransactionDataManager : NSObject {
    var coreDataStore : CoreDataStore?
    
    /**
     Get wallet: address and private key of an user in localDB.
     - Author:
     Hoang Nguyen
     
     - parameters:
     - id: User id. Can not be empty.
     
     - Important:
     This code has gone through QA.
     
     - Version:
     0.1
     */
    func getWalletByUserId(_ id : String) -> Promise<WalletModel> {
        return (coreDataStore?.getWalletByUserId(id))!
    }
}
