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
        pinUserInterface?.displaySpinner()
        walletInteractor?.verifyPIN(pin: pin)
    }
    
    func manageWallet(passPhrase: String?, pin: String) {
        walletInteractor?.manageWallet(passPhrase, pin: pin)
    }
    
    func verifyConfirmPIN(pin: String, confirmPin: String) {
        self.walletInteractor?.verifyConfirmPIN(pin: pin, confirmPin: confirmPin)
    }
    
    func generateMnemonics() {
        walletInteractor?.generateMnemonics()
    }
    
    func skipShowPassPharse(passPharse: String) {
        walletWireframe?.presentPINInterface(passPharse: passPharse)
    }
}

extension WalletPresenter: WalletInteractorOutput {
    func errorWhileManageWallet(_ error: String, showTryAgain: Bool = false) {
        if showTryAgain {
            pinUserInterface?.displayTryAgain(error)
        } else {
            pinUserInterface?.displayError(error)
        }
    }
    
    func updatedWallet() {
        // New wallet
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
            // Existing wallet
            handleEndingWalletFlow()
        } else {
            walletInteractor?.checkServerWalletExisting()
        }
    }
    
    func verifiedPIN(_ pin: String, result: Bool, needManagedWallet: Bool) {
        if result {
            if needManagedWallet {
                // New wallet
                pinUserInterface?.showCreatingInterface()
            } else {
                walletWireframe?.dismissWalletInterface()
                // Delegate
                pinModuleDelegate?.verifiedPINSuccess(pin)
            }
        } else {
            pinUserInterface?.removeSpinner()
            // Input PIN is NOT correct
            pinUserInterface?.showVerificationFailed()
        }
    }
    
    func generatedMnemonics(mnemonic: String) {
        passPharseUserInterface?.showPassPhrase(passPharse: mnemonic)
    }
}
