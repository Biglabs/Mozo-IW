//
//  WalletModuleInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/29/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation

protocol WalletModuleInterface {
    func processInitialWalletInterface()
    
    func generateMnemonics()
    func skipShowPassPharse(passPharse : String)
    
    func enterPIN(pin: String)
    func verifyPIN(pin: String)
    func manageWallet(passPhrase: String?, pin: String)
    func verifyConfirmPIN(pin: String, confirmPin: String)
}
