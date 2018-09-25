//
//  TxCompletionPresenter.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation

class TxCompletionPresenter : NSObject {
    var completionModuleDelegate: TxCompletionModuleDelegate?    
}

extension TxCompletionPresenter : TxCompletionModuleInterface {
    func requestAddToAddressBook(_ address: String) {
        completionModuleDelegate?.requestAddToAddressBook(address)
    }
    
    func requestShowDetail(_ tx: IntermediaryTransactionDTO, tokenInfo: TokenInfoDTO) {
        completionModuleDelegate?.requestShowDetail(tx, tokenInfo: tokenInfo)
    }
}
