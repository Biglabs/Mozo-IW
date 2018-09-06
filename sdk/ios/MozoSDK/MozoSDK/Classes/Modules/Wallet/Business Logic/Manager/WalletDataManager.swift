//
//  WalletDataManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/29/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation

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
        let predicate = NSPredicate(format: "id == %@", id as CVarArg)
        coreDataStore?.fetchEntriesWithPredicate(predicate, completionBlock: { (users) in
            if users.count > 0 {
                let user = users.first
                
                let newWallet = self.coreDataStore?.newWallet()
                newWallet?.address = wallet.address
                newWallet?.privateKey = wallet.privateKey
                newWallet?.user = user
                
                user?.wallets?.adding(newWallet!)
                
                self.coreDataStore?.save()
            }
        })
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
        let predicate = NSPredicate(format: "id == %@", id as CVarArg)
        coreDataStore?.fetchEntriesWithPredicate(predicate, completionBlock: { (users) in
            if users.count > 0 {
                let user = users.first
                user?.pin = pin
                user?.mnemonic = mnemonic.encrypt(key: pin)
                self.coreDataStore?.save()
            }
        })
    }
    
    func getUserById(_ id: String, completion: ((UserModel) -> Void)!) {
        let predicate = NSPredicate(format: "id == %@", id as CVarArg)
        coreDataStore?.fetchEntriesWithPredicate(predicate, completionBlock: { (users) in
            if users.count > 0 {
                let user : UserModel = users.map { entry in
                    UserModel(id: entry.id, mnemonic: entry.mnemonic, pin: entry.pin, wallets: entry.wallets)
                    }.first!
                completion(user)
            }
        })
    }
    
    func getWallet(completion: (([WalletModel]) -> Void)!){
        
        coreDataStore?.fetchWallets(completionBlock: { entries in
            let walletModels = self.walletFromDataStoreEntries(entries)
            completion(walletModels)
         })
    }
    
    func walletFromDataStoreEntries(_ entries: [ManagedWallet]) -> [WalletModel] {
        let walletModels : [WalletModel] = entries.map { entry in
            WalletModel(address: entry.address!, privateKey: entry.privateKey!)
        }
        
        return walletModels
    }
}
