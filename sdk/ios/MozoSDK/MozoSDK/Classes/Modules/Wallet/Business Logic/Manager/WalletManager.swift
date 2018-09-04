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
    
    func generateMnemonics() -> String? {
        let mnemonics = try! BIP39.generateMnemonics(bitsOfEntropy: 128)
        printTest()
        return mnemonics
    }
    
    func createNewWallet(mnemonics: String) -> WalletModel {
        let path = "m/44'/60'/0'/0"
        let keystore = try! BIP32Keystore(mnemonics: mnemonics, password: "", mnemonicsPassword: "", prefixPath: path)
        let account = keystore!.addresses![0]
        let key = try! keystore!.UNSAFE_getPrivateKeyData(password: "", account: account)
        let wallet = WalletModel.init(address: account.address, privateKey: key.toHexString())
        return wallet
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
