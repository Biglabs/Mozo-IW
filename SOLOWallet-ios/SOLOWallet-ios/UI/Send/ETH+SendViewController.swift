//
//  ETH+SendViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 7/4/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import SoloSDK

extension SendViewController {
    func validateETH() -> Bool {
        //TODO: Check gas price || gas limit
        return true
    }
    func signTransactionETH(transaction : ETH_TransactionDTO) {
        self.soloSDK.singner?.signTransactionETH(fromAddress: transaction.from!, toAddress: transaction.to!, value: transaction.value!, coinType: CoinType.ETH.key){ result in
            self.handleSignResult(result:result)
        }
    }
}
