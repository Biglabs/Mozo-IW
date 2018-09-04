//
//  WalletInteractor.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import CryptoSwift

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
    func handleEnterPIN(pin: String) {
        output?.showConfirmPIN()
    }
    
    func verifyPIN(rawPIN: String) {
        // Get User from UserDefaults
        // Get ManagedUser from User.id
        // Compare PIN
//        dataManager.getWallet { (wallets) in
//            let wallet = wallets.first
//            print(wallet)
//        }
    }
    
    func manageWallet(_ mnemonics: String?, pin: String) {
        if let m = mnemonics {
            let wallet = walletManager.createNewWallet(mnemonics: m)
            
            dataManager.addNewWallet(wallet)
        } else {
            
        }
        output?.dismissWalletInterface()
    }
    
    func verifyConfirmPIN(pin: String, confirmPin: String) {
        if pin == confirmPin {
            output?.showCreatingInterface()
        } else {
            output?.showVerificationFailed()
        }
    }
    
    func generateMnemonics(){
        let mnemonics = walletManager.generateMnemonics()
        output?.generatedMnemonics(mnemonic: mnemonics!)
    }
}
