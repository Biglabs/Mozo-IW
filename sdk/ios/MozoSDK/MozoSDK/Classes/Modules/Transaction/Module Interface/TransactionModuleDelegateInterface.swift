//
//  TransactionModuleDelegateInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/18/18.
//

import Foundation

protocol TransactionModuleDelegate {
    func requestPINInterfaceForTransaction()
    func removePINDelegate()
    func didSendTxSuccess(_ tx: IntermediaryTransactionDTO)
}
