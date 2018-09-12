//
//  WalletInteractor.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import web3swift

class WalletInteractor : NSObject {
    var output : WalletInteractorOutput?
    
    let walletManager : WalletManager
    let dataManager : WalletDataManager
    let apiManager : ApiManager
        
    init(walletManager: WalletManager, dataManager: WalletDataManager, apiManager: ApiManager) {
        self.walletManager = walletManager
        self.dataManager = dataManager
        self.apiManager = apiManager
    }
    
    func updateWalletForCurrentUser(_ wallet: WalletModel){
        if let userObj = SessionStoreManager.loadCurrentUser() {
            dataManager.updateWallet(wallet, id: userObj.id!)
        }
    }
    
    func updateMnemonicAndPinForCurrentUser(mnemonic: String, pin: String) {
        if let userObj = SessionStoreManager.loadCurrentUser() {
            dataManager.updateMnemonic(mnemonic, id: userObj.id!, pin: pin)
        }
    }
    
    func updateWalletToUserProfile(){
        if let userObj = SessionStoreManager.loadCurrentUser() {
            _ = dataManager.getUserById(userObj.id!).done { (user) in
                let profile = userObj.profile
                if profile?.walletInfo == nil {
                    profile?.walletInfo = user.mnemonic
                    _ = self.apiManager.updateUserProfile(userProfile: profile!)
                        .done { result -> Void in
                            print("Update Wallet To User Profile result: [\(result)]")
                    }
                }
            }
        }
    }
}

extension WalletInteractor : WalletInteractorInput {
    func checkLocalWalletExisting() {
        if let userObj = SessionStoreManager.loadCurrentUser() {
            _ = dataManager.getUserById(userObj.id!).done { (user) in
                self.output?.finishedCheckLocal(result: (user.wallets?.count)! > 0)
            }
        }
    }
    
    func checkServerWalletExisting() {
        if let userObj = SessionStoreManager.loadCurrentUser() {
            // Get UserProfile
            let profile = userObj.profile
            self.output?.finishedCheckServer(result: profile?.walletInfo != nil)
        }
    }
    
    func verifyPIN(pin: String) {
        // Get User from UserDefaults
        if let userObj = SessionStoreManager.loadCurrentUser() {
            // Get ManagedUser from User.id
            _ = dataManager.getUserById(userObj.id!).done { (user) in
                var compareResult = false
                if user.pin?.isEmpty == false {
                    // Compare PIN
                    compareResult = pin.toSHA512() == user.pin
                } else {
                    // Incase: restore wallet from server mnemonics
                    let mnemonic = userObj.profile?.walletInfo?.decrypt(key: pin)
                    
                    if BIP39.mnemonicsToEntropy(mnemonic!) == nil {
                        print("😞 Invalid mnemonics")
                        compareResult = false
                    } else {
                        self.updateMnemonicAndPinForCurrentUser(mnemonic: mnemonic!, pin: pin)
                        compareResult = true
                    }
                }
                self.output?.verifiedPIN(result: compareResult)
            }
        }
    }
    
    func manageWallet(_ mnemonics: String?, pin: String) {
        var mne = mnemonics
        if mnemonics == nil {
            // Get user to get mnemonics
            if let userObj = SessionStoreManager.loadCurrentUser() {
                // Get UserProfile
                let profile = userObj.profile
                // Get wallet - mnemonics
                mne = profile?.walletInfo?.decrypt(key: pin)
            }
        } else {
            // A new wallet has just been created.
            updateMnemonicAndPinForCurrentUser(mnemonic: (mne?.encrypt(key: pin))!, pin: pin)
        }
        var wallet = walletManager.createNewWallet(mnemonics: mne!)
        wallet.privateKey = wallet.privateKey.encrypt(key: pin)
        updateWalletForCurrentUser(wallet)
        updateWalletToUserProfile()
        output?.updatedWallet()
    }
    
    func verifyConfirmPIN(pin: String, confirmPin: String) {
        let compareResult = (pin == confirmPin)
        self.output?.verifiedPIN(result: compareResult)
    }
    
    func generateMnemonics(){
        let mnemonics = walletManager.generateMnemonics()
        output?.generatedMnemonics(mnemonic: mnemonics!)
    }
}
