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
    
    func addNewWallet(_ wallet: WalletModel){
        if let userObj = SessionStoreManager.loadCurrentUser() {
            dataManager.updateWallet(wallet, id: userObj.id!)
        }
    }
    
    func updateWalletToUserProfile(){
        if let userObj = SessionStoreManager.loadCurrentUser() {
            dataManager.getUserById(userObj.id!) { (user) in
                let profile = userObj.profile
                if profile?.wallet == nil {
                    profile?.wallet = user.mnemonic
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
            dataManager.getUserById(userObj.id!) { (user) in
                // Check local wallet is existing or not
                if (user.wallets?.count)! > 0 {
                    // Existing
                    self.output?.dismissWalletInterface()
                } else {
                    // Not existing in local
                    // Get UserProfile
                    let profile = userObj.profile
                    // Get wallet - mnemonics
                    if profile?.wallet != nil {
                        // Input PIN
                        self.output?.presentPINInterface()
                    } else {
                        // Create new wallet
                        self.output?.presentPassPhraseInterface()
                    }
                }
            }
        }
    }
    
    func handleEnterPIN(pin: String) {
        output?.showConfirmPIN()
    }
    
    func verifyPIN(pin: String) {
        // Get User from UserDefaults
        if let userObj = SessionStoreManager.loadCurrentUser() {
            // Get ManagedUser from User.id
            dataManager.getUserById(userObj.id!) { (user) in
                var compareResult = false
                if user.pin?.isEmpty == false {
                    // Compare PIN
                    compareResult = pin.toSHA512() == user.pin
                } else {
                    // Incase: restore wallet from server mnemonics
                    let mnemonic = userObj.profile?.wallet?.decrypt(key: pin)
                    
                    if BIP39.mnemonicsToEntropy(mnemonic!) == nil {
                        print("Invalid mnemonics")
                        compareResult = false
                    } else {
                        self.dataManager.updateMnemonic(mnemonic!, id: user.id!, pin: pin)
                        compareResult = true
                    }
                }
                if compareResult {
                    // Input PIN is correct
                    self.output?.showCreatingInterface()
                    // -> Manage wallet
                } else {
                    // Input PIN is NOT correct
                    self.output?.showVerificationFailed()
                }
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
                mne = profile?.wallet?.decrypt(key: pin)
            }
        }
        var wallet = walletManager.createNewWallet(mnemonics: mne!)
        wallet.privateKey = wallet.privateKey.encrypt(key: pin)
        addNewWallet(wallet)
        updateWalletToUserProfile()
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
