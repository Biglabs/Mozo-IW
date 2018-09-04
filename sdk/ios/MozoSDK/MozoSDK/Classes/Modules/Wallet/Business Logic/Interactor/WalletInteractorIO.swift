//
//  WalletInteractorIO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation

protocol WalletInteractorInput {
    func checkLocalWalletExisting()
    
    func handleEnterPIN(pin: String)
    func manageWallet(_ mnemonics: String?, pin: String)
    func verifyPIN(pin: String)
    func generateMnemonics()
    func verifyConfirmPIN(pin: String, confirmPin: String)
}

protocol WalletInteractorOutput {
    func presentPassPhraseInterface()
    func presentPINInterface()
    
    func showConfirmPIN()
    func showVerificationFailed()
    func generatedMnemonics(mnemonic: String)
    func showCreatingInterface()
    func dismissWalletInterface()
}
