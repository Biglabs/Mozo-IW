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
    func checkLocalWalletExisting() {
        // Check local wallet is existing or not
        dataManager.getWallet { (wallets) in
            let isExisting = wallets.count > 0
            if isExisting {
                self.output?.presentPINInterface()
            } else {
                self.output?.presentPassPhraseInterface()
            }
        }
    }
    
    func handleEnterPIN(pin: String) {
        output?.showConfirmPIN()
    }
    
    func verifyPIN(pin: String) {
        // Get User from UserDefaults
        if let userObj = UserDefaults.standard.object(forKey: Configuration.USER_INFO) {
            let userInfo = userObj as! UserModel
            // Get ManagedUser from User.id
            dataManager.getUserById(userInfo.id) { (user) in
                // Compare PIN
                if pin.toSHA512() == user.pin {
                    // Input PIN is correct
                    self.output?.showCreatingInterface()
                } else {
                    // Input PIN is NOT correct
                    self.output?.showVerificationFailed()
                }
            }
        } else {
            print("Not found User Info")
        }
    }
    
    func manageWallet(_ mnemonics: String?, pin: String) {
        if let m = mnemonics {
            var wallet = walletManager.createNewWallet(mnemonics: m)
            wallet.privateKey = wallet.privateKey.encrypt(key: pin)
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
