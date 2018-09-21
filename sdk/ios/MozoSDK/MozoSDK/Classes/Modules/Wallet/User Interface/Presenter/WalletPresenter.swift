//
//  WalletPresenter.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit

class WalletPresenter : NSObject {
    var walletInteractor : WalletInteractorInput?
    var walletWireframe : WalletWireframe?
    var pinUserInterface : PINViewInterface?
    var passPharseUserInterface : PassPhraseViewInterface?
    var walletModuleDelegate : WalletModuleDelegate?
    var pinModuleDelegate: PinModuleDelegate?
    
    func handleEndingWalletFlow() {
        walletModuleDelegate?.walletModuleDidFinish()
    }
}

extension WalletPresenter: WalletModuleInterface {
    func processInitialWalletInterface() {
        walletInteractor?.checkLocalWalletExisting()
    }
    
    func enterPIN(pin: String) {
        pinUserInterface?.showConfirmPIN()
    }
    
    func verifyPIN(pin: String) {
        walletInteractor?.verifyPIN(pin: pin)
    }
    
    func manageWallet(passPhrase: String?, pin: String) {
        walletInteractor?.manageWallet(passPhrase, pin: pin)
    }
    
    func verifyConfirmPIN(pin: String, confirmPin: String) {
        walletInteractor?.verifyConfirmPIN(pin: pin, confirmPin: confirmPin)
    }
    
    func generateMnemonics() {
        walletInteractor?.generateMnemonics()
    }
    
    func skipShowPassPharse(passPharse: String) {
        walletWireframe?.presentPINInterface(passPharse: passPharse)
    }
}

extension WalletPresenter: WalletInteractorOutput {
    func updatedWallet() {
        handleEndingWalletFlow()
    }
    
    func finishedCheckServer(result: Bool) {
        if result {
            walletWireframe?.presentPINInterface(passPharse: nil)
        } else {
            walletWireframe?.presentPassPhraseInterface()
        }
    }
    
    func finishedCheckLocal(result: Bool) {
        if result {
            handleEndingWalletFlow()
        } else {
            walletInteractor?.checkServerWalletExisting()
        }
    }
    
    func verifiedPIN(_ pin: String, result: Bool, needManagedWallet: Bool) {
        if result {
            if needManagedWallet {
                pinUserInterface?.showCreatingInterface()
            } else {
                walletWireframe?.dismissWalletInterface()
                // Delegate 
                pinModuleDelegate?.verifiedPINSuccess(pin)
            }
        } else {
            // Input PIN is NOT correct
            pinUserInterface?.showVerificationFailed()
        }
    }
    
    func generatedMnemonics(mnemonic: String) {
        passPharseUserInterface?.showPassPhrase(passPharse: mnemonic)
    }
}
