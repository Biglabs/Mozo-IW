//
//  TxDetailDisplayItem.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/26/18.
//

import Foundation
struct TxDetailDisplayItem {
    let action : String
    let addressFrom : String
    let addressTo : String
    let amount : Double
    let exAmount : Double
    let dateTime : String
    var fees: Double?
    var symbol: String?
    
    let currentBalance: Double
    let exCurrentBalance: Double
    let currentAddress: String
}
