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
                        let tosign = interTx.tosign?.first?.replace("0x", withString: "")
                        
                        let publicData = Web3Utils.privateToPublic(buffer!)
                        
                        let signature = tosign?.ethSign(privateKey: decryptedPrivateKey)
                        
                        interTx.signatures![0] = signature!
                        interTx.pubkeys![0] = (publicData?.toHexString())!
                        
                        seal.fulfill(interTx)
                    }
                })
            }
        }
    }
}
