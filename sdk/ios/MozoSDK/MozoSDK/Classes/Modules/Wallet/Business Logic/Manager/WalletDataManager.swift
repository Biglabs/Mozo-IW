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
     
     - Important:
     This code has gone through QA.
     
     - Version:
     0.1
     */
    func addNewWallet(_ wallet: WalletModel) {
        let newWallet = coreDataStore?.newWallet()
        newWallet?.address = wallet.address
        newWallet?.privateKey = wallet.privateKey
        
        coreDataStore?.save()
    }
    
    func getUserById(_ id: String, completion: ((UserModel) -> Void)!) {
        let predicate = NSPredicate(format: "id == %@", id as CVarArg)
        let sortDescriptors: [NSSortDescriptor] = []
        coreDataStore?.fetchEntriesWithPredicate(predicate, sortDescriptors: sortDescriptors, completionBlock: { (users) in
            if users.count > 0 {
                let user : UserModel = users.map { entry in
                    UserModel(id: entry.id, mnemonic: entry.mnemonic, pin: entry.pin)
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
