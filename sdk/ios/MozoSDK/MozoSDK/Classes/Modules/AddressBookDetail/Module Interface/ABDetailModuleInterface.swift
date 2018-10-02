//
//  ABDetailModuleInterface.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation

protocol ABDetailModuleInterface {
    func cancelSaveAction()
    func saveAddressBookWithName(_ name: String, address: String)
    func finishSaveAddressBook()
}
