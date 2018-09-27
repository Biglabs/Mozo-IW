//
//  DetailInfoDisplayItem.swift
//  Alamofire
//
//  Created by Hoang Nguyen on 9/27/18.
//

import Foundation

public struct DetailInfoDisplayItem {
    let balance : Double
    let address: String
    
    init(balance: Double, address: String) {
        self.balance = balance
        self.address = address
    }
    
    init(tokenInfo: TokenInfoDTO) {
        self.balance = (tokenInfo.balance?.convertOutputValue(decimal: tokenInfo.decimals ?? 0))!
        self.address = tokenInfo.address!
    }
}
