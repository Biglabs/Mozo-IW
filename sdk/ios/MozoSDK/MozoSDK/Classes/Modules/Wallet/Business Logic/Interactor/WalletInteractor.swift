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
    
    func updateWalletToUserProfile(wallet: WalletModel) {
        if let userObj = SessionStoreManager.loadCurrentUser() {
            _ = dataManager.getUserById(userObj.id!).done { (user) in
                let profile = userObj.profile
                if profile?.walletInfo?.encryptSeedPhrase == nil || profile?.walletInfo?.offchainAddress == nil {
                    let offchainAddress = wallet.address
                    let walletInfo = WalletInfoDTO(encryptSeedPhrase: user.mnemonic, offchainAddress: offchainAddress)
                    _ = self.apiManager.updateWalletToUserProfile(walletInfo: walletInfo)
                        .done { uProfile -> Void in
                            let userDto = UserDTO(id: uProfile.userId, profile: uProfile)
                            SessionStoreManager.saveCurrentUser(user: userDto)
                            print("Update Wallet To User Profile result: [\(uProfile)]")
                            self.updateWalletForCurrentUser(wallet)
                            self.output?.updatedWallet()
                        }.catch({ (error) in
                            self.output?.errorWhileManageWallet("Network error. Please try again.", showTryAgain: true)
                        })
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
            self.output?.finishedCheckServer(result: profile?.walletInfo?.encryptSeedPhrase != nil && profile?.walletInfo?.offchainAddress != nil)
        }
    }
    
    func verifyPIN(pin: String) {
        // Get User from UserDefaults
        if let userObj = SessionStoreManager.loadCurrentUser() {
            // Get ManagedUser from User.id
            _ = dataManager.getUserById(userObj.id!).done { (user) in
                var compareResult = false
                var needManageWallet = false
                if user.pin?.isEmpty == false {
                    // Compare PIN
                    compareResult = pin.toSHA512() == user.pin
                } else {
                    needManageWallet = true
                    // Incase: restore wallet from server mnemonics
                    let mnemonic = userObj.profile?.walletInfo?.encryptSeedPhrase?.decrypt(key: pin)
                    // TODO: Handle mnemonic nil here
                    if BIP39.mnemonicsToEntropy(mnemonic!) == nil {
                        print("😞 Invalid mnemonics")
                        compareResult = false
                    } else {
                        self.updateMnemonicAndPinForCurrentUser(mnemonic: (userObj.profile?.walletInfo?.encryptSeedPhrase)!, pin: pin)
                        compareResult = true
                    }
                }
                self.output?.verifiedPIN(pin, result: compareResult, needManagedWallet: needManageWallet)
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
                mne = profile?.walletInfo?.encryptSeedPhrase?.decrypt(key: pin)
            }
        } else {
            // A new wallet has just been created.
            updateMnemonicAndPinForCurrentUser(mnemonic: (mne?.encrypt(key: pin))!, pin: pin)
        }
        var wallet = walletManager.createNewWallet(mnemonics: mne!)
        wallet.privateKey = wallet.privateKey.encrypt(key: pin)
        updateWalletToUserProfile(wallet: wallet)
    }
    
    func verifyConfirmPIN(pin: String, confirmPin: String) {
        let compareResult = (pin == confirmPin)
        self.output?.verifiedPIN(pin, result: compareResult, needManagedWallet: true)
    }
    
    func generateMnemonics(){
        let mnemonics = walletManager.generateMnemonics()
        output?.generatedMnemonics(mnemonic: mnemonics!)
    }
}
