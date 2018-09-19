//
//  CoreModuleDelegateInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/13/18.
//

import Foundation

@objc public protocol AuthenticationDelegate {
    func mozoAuthenticationDidFinish()
    func mozoLogoutDidFinish()
    func mozoUIDidCloseAll()
}

protocol TransactionDelegate {
    func transferDidFinish()
    func transferDidCancelByUser()
}
