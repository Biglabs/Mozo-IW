//
//  TransactionSignManager.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/21/18.
//

import Foundation
import PromiseKit
import web3swift

public class TransactionSignManager {
    let dataManager : TransactionDataManager
    
    init(dataManager: TransactionDataManager) {
        self.dataManager = dataManager
    }
    
    public func signTransaction(_ interTx: IntermediaryTransactionDTO, pin: String) -> Promise<IntermediaryTransactionDTO> {
        return Promise { seal in
            if let userObj = SessionStoreManager.loadCurrentUser(), let profile = userObj.profile, let userId = profile.userId {
                _ = dataManager.getWalletByUserId(userId).done({ (wallet) in
                    if !wallet.privateKey.isEmpty {
                        let decryptedPrivateKey = wallet.privateKey.decrypt(key: pin)
                        let buffer = decryptedPrivateKey.data(using: .utf8)
                        let tosign = interTx.tosign?.first?.replace("0x", withString: "").data(using: .utf8)
                        
                        let publicData = Web3Utils.privateToPublic(buffer!)
                        
                    }
                })
            }
        }
    }
    
    /**
     Signing message by using private key
     
     - Parameter message: Message that should be signed
     - Parameter address: Public address
     - Parameter privateKey: Address's private key
     
     - Returns: Signed message, that can be verified at https://www.myetherwallet.com/signmsg.html
     or **nil** if something goes wrong
     */
//    func signMessage(_ message: Data, address: String, privateKey: Data) -> String? {
//        guard let hashData = Web3.Utils.hashPersonalMessage(message) else { return nil }
//        
//        guard let signedData = SECP256K1.signForRecovery(hash: hashData, privateKey: privateKey, useExtraEntropy: false).serializedSignature else { return nil }
//        let signedMessage = signedData.toHexString().addHexPrefix()
//        return signedMessage
//    }
}
