//
//  WalletInteractorIO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation

protocol WalletInteractorInput {
    func savePIN(pin: String)
    func verifyPIN(rawPIN: String)
    func generateMnemonics()
}

protocol WalletInteractorOutput {
    func pinVerificationResult(result: Bool)
    func generatedMnemonics(mnemonic: String)
}
