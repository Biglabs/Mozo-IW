//
//  TxHistoryDisplayItem.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 10/3/18.
//

import Foundation

struct TxHistoryDisplayItem {
    let action : String
    let date : String
    let amount: Double
    
    var addressFrom: String?
    var addressTo: String?
}
