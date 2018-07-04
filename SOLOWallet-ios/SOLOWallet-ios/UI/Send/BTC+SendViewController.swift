//
//  BTC+SendViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 7/4/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import SoloSDK

extension SendViewController {
    func validateBTC() -> Bool {
        return true
    }
    func signTransactionBTC(transaction : BTC_TransactionDTO) {
        self.soloSDK.singner?.signTransactionBTC(inputs: transaction.inputs!, outputs: transaction.outputs!, coinType: CoinType.BTC.key){ result in
            self.handleSignResult(result:result)
        }
    }
}
