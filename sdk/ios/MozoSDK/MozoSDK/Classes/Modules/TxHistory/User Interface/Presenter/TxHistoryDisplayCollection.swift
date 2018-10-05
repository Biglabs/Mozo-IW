//
//  TxHistoryDisplayCollection.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 10/3/18.
//

import Foundation

class TxHistoryDisplayCollection {
    var displayItems : [TxHistoryDisplayItem]
    
    init(items: [TxHistoryDTO]) {
        displayItems = []
        for item in items {
            // Filter transaction success
            if item.txStatus != TransactionStatusType.FAILED.rawValue {
                let displayItem = displayItemForTxHistoryDTO(item)
                displayItems.append(displayItem)
            }
        }
    }
    
    func appendCollection(_ collection: TxHistoryDisplayCollection) {
        displayItems = displayItems + collection.displayItems
    }
    
    func displayItemForTxHistoryDTO(_ txHistory: TxHistoryDTO) -> TxHistoryDisplayItem {
        let action = self.buildAction(addressFrom: txHistory.addressFrom!)
        let date = self.formattedDateTime(txHistory.time ?? 0)
        let amount = (txHistory.amount?.convertOutputValue(decimal: Int(txHistory.decimal!)))!
        let exAmount = self.calculateExchangeValue(amount)
        return TxHistoryDisplayItem(action: action, date: date, amount: amount, exAmount: exAmount, txStatus: txHistory.txStatus ?? "", addressFrom: txHistory.addressFrom, addressTo: txHistory.addressTo)
    }
    
    func buildAction(addressFrom: String) -> String {
        let currentAddress = SessionStoreManager.loadCurrentUser()?.profile?.walletInfo?.offchainAddress
        var action = TransactionType.Received.value
        if addressFrom.lowercased() == currentAddress?.lowercased() {
            action = TransactionType.Sent.value
        }
        return action
    }
    
    func formattedDateTime(_ dateTime: Int64) -> String {
        let format = "MMM dd, yyyy - HH:mm a"
        return DisplayUtils.convertInt64ToStringWithFormat(dateTime, format: format)
    }
    
    func filterByTransactionType(_ txType: TransactionType) -> [TxHistoryDisplayItem] {
        let filteredArray = displayItems.filter({( item : TxHistoryDisplayItem) -> Bool in
            return item.action == txType.value
        })
        return filteredArray
    }
    
    func calculateExchangeValue(_ value: Double) -> Double {
        var result = 0.0
        if let rateInfo = SessionStoreManager.exchangeRateInfo {
            let type = CurrencyType(rawValue: rateInfo.currency?.uppercased() ?? "")
            if let type = type, let rateValue = rateInfo.rate {
                result = (value * rateValue).rounded(toPlaces: type.decimalRound)
            }
        }
        return result
    }
}
