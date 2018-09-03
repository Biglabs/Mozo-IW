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
    
    func addNewWallet(_ wallet: WalletModel) {
        let newWallet = coreDataStore?.newWallet()
        newWallet?.address = wallet.address
        newWallet?.privateKey = wallet.privateKey
        
        coreDataStore?.save()
    }
    
    func getWallet(completion: (([WalletModel]) -> Void)!){
        
        coreDataStore?.fetchWalletsWithPredicate(completionBlock: { entries in
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
