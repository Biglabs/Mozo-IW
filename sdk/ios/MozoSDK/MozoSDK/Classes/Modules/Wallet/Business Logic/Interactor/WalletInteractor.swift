//
//  WalletInteractor.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import web3swift

class WalletInteractor : NSObject, WalletInteractorInput {
    var output : WalletInteractorOutput?
    
    func savePIN(pin: String) {
        
    }
    
    func verifyPIN(rawPIN: String) {
        
    }
    
    func generateMnemonics() {
        let mnemonics = try! BIP39.generateMnemonics(bitsOfEntropy: 128)
        let importedMnemonic = "test pizza drift whip rebel empower flame mother service grace sweet kangaroo"
        let seed = BIP39.seedFromMmemonics(importedMnemonic)
        print("Seed: [\(seed?.toHexString())]")
        
        let path = "m/44'/60'/0'/0"
        let keystore = try! BIP32Keystore(mnemonics: importedMnemonic, password: "", mnemonicsPassword: "", prefixPath: path)
        let account = keystore!.addresses![0]
        print("Address: [\(account.address)]")
        let key = try! keystore!.UNSAFE_getPrivateKeyData(password: "", account: account)
        print("Private key: [\(key.toHexString())]")
        let pubKey = Web3.Utils.privateToPublic(key, compressed: true)
        print("Public key: [\(pubKey?.toHexString())]")
    }
}
