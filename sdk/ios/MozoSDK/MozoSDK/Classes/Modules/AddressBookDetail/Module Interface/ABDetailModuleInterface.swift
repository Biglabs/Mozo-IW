//
//  ABDetailModuleInterface.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation

protocol ABDetailModuleInterface {
    func cancelSaveAction()
    func detailSaveActionWithName(_ name: String, address: String)
}
