//
//  TxCompletionModuleInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation

protocol TxCompletionModuleInterface {
    func requestAddToAddressBook(_ address: String)
    func requestShowDetail(_ tx: IntermediaryTransactionDTO, tokenInfo: TokenInfoDTO)
}
