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
}
