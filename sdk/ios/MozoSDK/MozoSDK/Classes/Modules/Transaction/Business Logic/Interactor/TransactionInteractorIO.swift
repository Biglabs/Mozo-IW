//
//  TransactionInteractorIO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/18/18.
//

import Foundation

protocol TransactionInteractorInput {
    func loadTokenInfo()
    func validateTransferTransaction(tokenInfo: TokenInfoDTO?, toAdress: String?, amount: String?, displayName: String?)
    func sendUserConfirmTransaction(_ transaction: TransactionDTO)
    func performTransfer(pin: String)
}

protocol TransactionInteractorOutput {
    func didLoadTokenInfo(_ tokenInfo: TokenInfoDTO)
    func didReceiveError(_ error: String?)
    func requestPinToSignTransaction()
    func didValidateTransferTransaction(_ error: String?)
    func continueWithTransaction(_ transaction: TransactionDTO, tokenInfo: TokenInfoDTO, displayName: String?)
    func didSendTransactionSuccess(_ transaction: IntermediaryTransactionDTO, tokenInfo: TokenInfoDTO)
}
