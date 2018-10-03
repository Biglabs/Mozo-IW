//
//  TxHistoryViewInterface.swift
//  MozoSDK
//
//  Created by HoangNguyen on 10/2/18.
//

import Foundation

protocol TxHistoryViewInterface {
    func showTxHistoryDisplayData(_ data: TxHistoryDisplayCollection, forPage: Int)
    func showNoContentMessage()
}
