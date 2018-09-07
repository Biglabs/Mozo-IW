//
//  WalletDataManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/29/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import PromiseKit

class WalletDataManager : NSObject {
    var coreDataStore : CoreDataStore?
    
    /**
     Save address and private key of an user to localDB.
     - Author:
     Hoang Nguyen
     
     - parameters:
     - wallet: The WalletModel. Can not be empty.
     - id: User id. Can not be empty.
     
     - Important:
     This code has gone through QA.
     
     - Version:
     0.1
     */
    func updateWallet(_ wallet: WalletModel, id : String) {
        let count = coreDataStore?.countById(id)
        if count != nil && count! > 0 {
            _ = coreDataStore?.updateWallet(wallet, toUser: id)
        }
    }
    
    /**
     Update mnemonic which is encrypted by using PIN
     - Author:
     Hoang Nguyen
     
     - parameters:
     - mnemonic: String. Can not be empty.
     - id: user id. Can not be empty.
     - pin: String. Can not be empty.
     
     - Important:
     This code has gone through QA.
     
     - Version:
     0.1
     */
    func updateMnemonic(_ mnemonic: String, id: String, pin: String) {
        let count = coreDataStore?.countById(id)
        if count != nil && count! > 0 {
            let userModel = UserModel(id: id,
                                      mnemonic: mnemonic,
                                      pin: pin.toSHA512(),
                                      wallets: nil)
            _ = coreDataStore?.updateUser(userModel)
        }
    }
    
    func getUserById(_ id: String) -> Promise<UserModel> {
        return (coreDataStore?.getUserById(id))!
    }
    
    func walletFromDataStoreEntries(_ entries: [ManagedWallet]) -> [WalletModel] {
        let walletModels : [WalletModel] = entries.map { entry in
            WalletModel(address: entry.address, privateKey: entry.privateKey)
        }
        
        return walletModels
    }
}
