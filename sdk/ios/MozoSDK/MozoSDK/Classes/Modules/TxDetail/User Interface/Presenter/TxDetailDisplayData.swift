//
//  TxDetailDisplayData.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 10/3/18.
//

import Foundation

class TxDetailDisplayData {
    var tokenInfo: TokenInfoDTO?
    var transaction: IntermediaryTransactionDTO?
    var txHistory: TxHistoryDisplayItem?
    
    init(transaction: IntermediaryTransactionDTO, tokenInfo: TokenInfoDTO) {
        self.transaction = transaction
        self.tokenInfo = tokenInfo
    }
    
    init(txHistory: TxHistoryDisplayItem, tokenInfo: TokenInfoDTO) {
        self.txHistory = txHistory
        self.tokenInfo = tokenInfo
    }
    
    func collectDisplayItem() -> TxDetailDisplayItem {
        if transaction != nil {
            return buildDisplayItemFromTransaction()
        }
        return buildDisplayItemFromHistory()
    }
    
    func buildDisplayItemFromTransaction() -> TxDetailDisplayItem {
        let amount = transaction?.tx?.outputs![0].value ?? 0
        let addressFrom = transaction?.tx?.inputs![0].addresses![0] ?? ""
        let addressTo = transaction?.tx?.outputs![0].addresses![0] ?? ""
        let decimal = tokenInfo?.decimals ?? 0
        let dateTime = Date()
        
        let balance = tokenInfo?.balance ?? 0.0
        let currentBalance = balance.convertOutputValue(decimal: decimal)
        let currentAddress = tokenInfo?.address ?? ""
        
        let action = buildAction(addressFrom: addressFrom, currentAddress: currentAddress)
        let cvAmount = amount.convertOutputValue(decimal: decimal)
        let cvDate = buildDateString(dateTime)
        let exAmount = calculateExchangeValue(cvAmount)
        let exCurrentBalance = calculateExchangeValue(currentBalance)
        
        let displayItem = TxDetailDisplayItem(action: action, addressFrom: addressFrom, addressTo: addressTo, amount: cvAmount, exAmount: exAmount, dateTime: cvDate, fees: 0, symbol: nil, hash: transaction?.tx?.hash ?? "", currentBalance: currentBalance, exCurrentBalance: exCurrentBalance, currentAddress: currentAddress)
        return displayItem
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
    
    func buildDisplayItemFromHistory() -> TxDetailDisplayItem {
        let balance = tokenInfo?.balance ?? 0.0
        let currentAddress = tokenInfo?.address ?? ""
        let currentBalance = balance.convertOutputValue(decimal: tokenInfo?.decimals ?? 0)
        let amount = txHistory?.amount ?? 0
        let exAmount = calculateExchangeValue(amount)
        let exCurrentBalance = calculateExchangeValue(currentBalance)
        
        let displayItem = TxDetailDisplayItem(action: txHistory?.action ?? "", addressFrom: txHistory?.addressFrom ?? "", addressTo: txHistory?.addressTo ?? "", amount: amount, exAmount: exAmount, dateTime: txHistory?.date ?? "", fees: 0, symbol: nil, hash: transaction?.tx?.hash ?? "", currentBalance: currentBalance, exCurrentBalance: exCurrentBalance, currentAddress: currentAddress)
        return displayItem
    }
    
    func buildAction(addressFrom: String, currentAddress: String) -> String {
        var action = TransactionType.Received.value
        if addressFrom.lowercased() == currentAddress.lowercased() {
            action = TransactionType.Sent.value
        }
        return action
    }
    
    func buildDateString(_ date: Date) -> String {
        let dateFormatterPrint = DateFormatter()
        dateFormatterPrint.dateFormat = "MMM dd, yyyy - HH:mm a"
        return dateFormatterPrint.string(from: date)
    }
}
