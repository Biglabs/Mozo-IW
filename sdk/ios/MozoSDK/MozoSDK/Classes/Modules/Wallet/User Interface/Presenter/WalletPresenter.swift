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
    var walletInteractor : WalletInteractor?
    var walletWireframe : WalletWireframe?
    var pinUserInterface : PINViewInterface?
    var passPharseUserInterface : PassPhraseViewInterface?
}

extension WalletPresenter: WalletModuleInterface {
    func enterPIN(pin: String) {
        walletInteractor?.handleEnterPIN(pin: pin)
    }
    
    func verifyPIN(pin: String) {
        walletInteractor?.verifyPIN(rawPIN: pin)
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
    func showConfirmPIN() {
        pinUserInterface?.showConfirmPIN()
    }
    
    func showCreatingInterface() {
        pinUserInterface?.showCreatingInterface()
    }
    
    func showVerificationFailed() {
        pinUserInterface?.showVerificationFailed()
    }
    
    func generatedMnemonics(mnemonic: String) {
        passPharseUserInterface?.showPassPhrase(passPharse: mnemonic)
    }
    
    func dismissWalletInterface() {
        walletWireframe?.dismissWalletInterface()
    }
}
