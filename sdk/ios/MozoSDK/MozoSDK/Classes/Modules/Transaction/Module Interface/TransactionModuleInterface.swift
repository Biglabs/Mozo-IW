//
//  TransactionModuleInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/18/18.
//

import Foundation

protocol TransactionModuleInterface {
    func validateTransferTransaction(tokenInfo: TokenInfoDTO?, toAdress: String?, amount: String?)
    func sendConfirmTransaction(_ transaction: TransactionDTO)
    func showScanQRCodeInterface()
    func updateUserInterfaceWithAddress(_ address: String)
    func loadTokenInfo()
}
