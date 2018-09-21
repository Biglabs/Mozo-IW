//
//  WalletModuleDelegateInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/13/18.
//

import Foundation

protocol WalletModuleDelegate {
    func walletModuleDidFinish()
}

protocol PinModuleDelegate {
    func verifiedPINSuccess(_ pin: String)
}

