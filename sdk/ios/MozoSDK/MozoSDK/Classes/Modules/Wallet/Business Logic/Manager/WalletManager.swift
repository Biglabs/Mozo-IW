//
//  WalletManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/27/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import web3swift

class WalletManager : NSObject {
    /// Manage wallet
    /// Create wallet
    /// Create address + private key
    
    /**
    Save address and private key of an user to localDB using userId.
     - Author:
     Hoang Nguyen
     
     - returns:
     A result of saving process.
     
     - throws:
     An error of type 'MozoError'
     
     - parameters:
        - userId: The id of user whose wallet is belonged to. Can not be empty.
        - wallet: The HD wallet. Can not be empty.
     
     - Important:
     This code has gone through QA.
     
     - Version:
     0.1
     
     
    */
    func generateMnemonics() -> String? {
        let mnemonics = try! BIP39.generateMnemonics(bitsOfEntropy: 128)
        printTest()
        return mnemonics
    }
    
    func printTest() {
        let importedMnemonic = "test pizza drift whip rebel empower flame mother service grace sweet kangaroo"
        let seed = BIP39.seedFromMmemonics(importedMnemonic)
        print("Seed: [\(seed?.toHexString() ?? "")]")
        
        let path = "m/44'/60'/0'/0"
        let keystore = try! BIP32Keystore(mnemonics: importedMnemonic, password: "", mnemonicsPassword: "", prefixPath: path)
        let account = keystore!.addresses![0]
        print("Address: [\(account.address)]")
        let key = try! keystore!.UNSAFE_getPrivateKeyData(password: "", account: account)
        print("Private key: [\(key.toHexString())]")
        let pubKey = Web3.Utils.privateToPublic(key, compressed: true)
        print("Public key: [\(pubKey?.toHexString() ?? "")]")
    }
}
