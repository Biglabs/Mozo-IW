//
//  WalletInteractor.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation

class WalletInteractor : NSObject {
    var output : WalletInteractorOutput?
    
    let walletManager : WalletManager
    let dataManager : WalletDataManager
    
    init(walletManager: WalletManager, dataManager: WalletDataManager) {
        self.walletManager = walletManager
        self.dataManager = dataManager
    }
}

extension WalletInteractor : WalletInteractorInput {
    func savePIN(pin: String) {
        
    }
    
    func verifyPIN(rawPIN: String) {
        
    }
    
    func generateMnemonics(){
        let mnemonics = walletManager.generateMnemonics()
        output?.generatedMnemonics(mnemonic: mnemonics!)
    }
}
