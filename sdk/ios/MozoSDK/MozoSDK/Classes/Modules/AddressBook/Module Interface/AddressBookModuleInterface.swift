//
//  AddressBookModuleInterface.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation

protocol AddressBookModuleInterface {
    func selectAddressBookOnUI(_ addressBook: AddressBookDisplayItem)
    func updateDisplayData()
}
