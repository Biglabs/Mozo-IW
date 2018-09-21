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
    func checkServerWalletExisting()
    
    func verifyPIN(pin: String)
    
    func manageWallet(_ mnemonics: String?, pin: String)
    
    func generateMnemonics()
    func verifyConfirmPIN(pin: String, confirmPin: String)
}

protocol WalletInteractorOutput {
    func finishedCheckLocal(result: Bool)
    func finishedCheckServer(result: Bool)
    
    func verifiedPIN(_ pin: String, result: Bool, needManagedWallet: Bool)
    
    func generatedMnemonics(mnemonic: String)
    
    func updatedWallet()
}
