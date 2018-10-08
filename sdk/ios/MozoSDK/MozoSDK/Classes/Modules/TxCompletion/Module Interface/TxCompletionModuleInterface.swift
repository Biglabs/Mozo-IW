//
//  TxCompletionModuleInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation

protocol TxCompletionModuleInterface {
    func requestWaitingForTxStatus(hash: String)
    func requestStopWaiting()
    func requestAddToAddressBook(_ address: String)
    func requestShowDetail(_ detail: TxDetailDisplayItem)
}
