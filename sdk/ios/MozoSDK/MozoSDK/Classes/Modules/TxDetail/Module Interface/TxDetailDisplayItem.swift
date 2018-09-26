//
//  TxDetailDisplayItem.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/26/18.
//

import Foundation
struct TxDetailDisplayItem {
    var action : String?
    let addressFrom : String
    let addressTo : String
    let amount : NSNumber
    let decimal : Int
    let dateTime : Date
    var fees: NSNumber?
    var symbol: String?
    
    let currentBalance: NSNumber
    let currentAddress: String
    
    init(transaction: IntermediaryTransactionDTO, tokenInfo: TokenInfoDTO) {
        self.amount = transaction.tx?.outputs![0].value ?? 0
        self.addressFrom = transaction.tx?.inputs![0].addresses![0] ?? ""
        self.addressTo = transaction.tx?.outputs![0].addresses![0] ?? ""
        self.decimal = tokenInfo.decimals ?? 0
        self.dateTime = Date()
        
        self.currentBalance = tokenInfo.balance ?? 0
        self.currentAddress = tokenInfo.address ?? ""
    }
}

extension TxDetailDisplayItem {
    func buildAction() -> String {
        var action = "RECEIVED"
        if addressFrom == currentAddress {
            action = "SENT"
        }
        return action
    }
    
    func buildDateString() -> String {
        let dateFormatterPrint = DateFormatter()
        dateFormatterPrint.dateFormat = "MMM dd, yyyy - HH:mm a"
        return dateFormatterPrint.string(from: dateTime)
    }
}
