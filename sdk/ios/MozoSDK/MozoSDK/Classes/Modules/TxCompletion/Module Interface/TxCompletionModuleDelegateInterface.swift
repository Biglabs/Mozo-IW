//
//  TxCompletionModuleDelegateInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation

protocol TxCompletionModuleDelegate {
    func requestAddToAddressBook(_ address: String)
    func requestShowDetail(_ tx: IntermediaryTransactionDTO)
}
