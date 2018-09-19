//
//  TransactionModuleInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/18/18.
//

import Foundation

protocol TransactionModuleInterface {
    func performTransfer()
    func showScanQRCodeInterface()
    func goBack()
}
