//
//  TxHistoryPresenter.swift
//  MozoSDK
//
//  Created by HoangNguyen on 10/2/18.
//

import Foundation

class TxHistoryPresenter : NSObject {
    var txhInteractor : TxHistoryInteractorInput?
    var txhWireframe : TxHistoryWireframe?
    var txhModuleDelegate : TxHistoryModuleDelegate?
    var txhUserInterface: TxHistoryViewInterface?
}
extension TxHistoryPresenter : TxHistoryModuleInterface {
    func selectTxHistoryOnUI(_ txHistory: TxHistoryDisplayItem) {
        txhModuleDelegate?.txHistoryModuleDidChooseItemOnUI(txHistory: txHistory)
    }
    
    func updateDisplayData(page: Int) {
        txhInteractor?.getListTxHistory(page: page)
    }
}
extension TxHistoryPresenter: TxHistoryInteractorOutput {
    func finishGetListTxHistory(_ txHistories: [TxHistoryDTO], forPage: Int) {
        if txHistories.count > 0 {
            let collection = TxHistoryDisplayCollection(items: txHistories)
            txhUserInterface?.showTxHistoryDisplayData(collection, forPage: forPage)
        } else {
            txhUserInterface?.showNoContentMessage()
        }
    }
}
