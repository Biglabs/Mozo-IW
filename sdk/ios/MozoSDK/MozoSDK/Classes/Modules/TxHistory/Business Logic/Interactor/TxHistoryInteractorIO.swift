//
//  TxHistoryInteractorIO.swift
//  MozoSDK
//
//  Created by HoangNguyen on 10/2/18.
//

import Foundation

protocol TxHistoryInteractorInput {
    func getListTxHistory(page: Int)
}

protocol TxHistoryInteractorOutput {
    func finishGetListTxHistory(_ txHistories: [TxHistoryDTO], forPage: Int)
}
