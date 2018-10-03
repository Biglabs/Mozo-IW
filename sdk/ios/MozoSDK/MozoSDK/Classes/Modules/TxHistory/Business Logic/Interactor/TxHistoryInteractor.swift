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
    
    func getTokenInfoForHistory(_ txHistory: TxHistoryDisplayItem) {
        if let userObj = SessionStoreManager.loadCurrentUser() {
            if let address = userObj.profile?.walletInfo?.offchainAddress {
                print("Address used to load token info: \(address)")
                apiManager.getTokenInfoFromAddress(address)
                    .done { (tokenInfo) in
                        self.output?.finishGetTokenInfo(tokenInfo, for: txHistory)
                    }.catch { (error) in
                        self.output?.errorWhileLoadTokenInfo(error: error.localizedDescription)
                    }
            }
        }
    }
}
