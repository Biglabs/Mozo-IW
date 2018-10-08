//
//  TxCompletionInteractorIO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 10/8/18.
//

import Foundation

protocol TxCompletionInteractorInput {
    func startWaitingStatusService(hash: String)
    func stopService()
}

protocol TxCompletionInteractorOutput {
    func didReceiveTxStatus(_ status: TransactionStatusType)
}
