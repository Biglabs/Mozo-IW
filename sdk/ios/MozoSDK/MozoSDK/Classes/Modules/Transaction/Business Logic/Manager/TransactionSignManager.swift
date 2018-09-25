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
                        let buffer = Data(hex: decryptedPrivateKey)
                        let tosign = interTx.tosign?.first?.replace("0x", withString: "")
                        
                        let publicData = Web3Utils.privateToPublic(buffer)?.dropFirst()
                        let publicStr = publicData?.toHexString().addHexPrefix()
                        
                        let signature = tosign?.ethSign(privateKey: decryptedPrivateKey)
                        
                        interTx.signatures = [signature!]
                        interTx.pubkeys = [publicStr!]
                        
                        seal.fulfill(interTx)
                    }
                })
            }
        }
    }
}
