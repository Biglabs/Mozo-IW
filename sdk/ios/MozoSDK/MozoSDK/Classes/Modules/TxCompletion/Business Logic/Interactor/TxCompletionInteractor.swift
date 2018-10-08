//
//  TxCompletionInteractor.swift
//  MozoSDK
//
//  Created by HoangNguyen on 10/7/18.
//

import Foundation

class TxCompletionInteractor: NSObject {
    var output: TxCompletionInteractorOutput?
    let apiManager: ApiManager
    var txStatusTimer: Timer?
    var txHash: String?
    
    init(apiManager : ApiManager) {
        self.apiManager = apiManager
    }
    
    @objc func loadTxStatus() {
        if let txHash = self.txHash {
            _ = apiManager.getTxStatus(hash: txHash).done({ (type) in
                self.handleTxCompleted(statusType: type)
            })
        }
    }
    
    func handleTxCompleted(statusType: TransactionStatusType) {
        if statusType != TransactionStatusType.PENDING {
            self.output?.didReceiveTxStatus(statusType)
            self.stopService()
        }
    }
}

extension TxCompletionInteractor: TxCompletionInteractorInput {
    func startWaitingStatusService(hash: String) {
        self.txHash = hash
        txStatusTimer = Timer.scheduledTimer(timeInterval: 10.0, target: self, selector: #selector(loadTxStatus), userInfo: nil, repeats: true)
    }
    
    func stopService() {
        txStatusTimer?.invalidate()
    }
}
