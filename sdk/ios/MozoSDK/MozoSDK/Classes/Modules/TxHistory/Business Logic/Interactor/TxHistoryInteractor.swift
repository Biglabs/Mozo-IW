//
//  TxHistoryInteractor.swift
//  MozoSDK
//
//  Created by HoangNguyen on 10/2/18.
//

import Foundation

class TxHistoryInteractor: NSObject {
    var output: TxHistoryInteractorOutput?
    let apiManager : ApiManager
    
    init(apiManager: ApiManager) {
        self.apiManager = apiManager
    }
}
extension TxHistoryInteractor : TxHistoryInteractorInput {
    func getListTxHistory(page: Int = 0) {
        if let userObj = SessionStoreManager.loadCurrentUser() {
            if let address = userObj.profile?.walletInfo?.offchainAddress {
                print("Address used to load tx history: \(address)")
                apiManager.getListTxHistory(address: address, page: page)
                .done { (listTxHistory) in
                    self.output?.finishGetListTxHistory(listTxHistory, forPage: page)
                }.catch { (error) in
                    // TODO: Handle in case error load tx history
                }
            }
        }
    }
}
