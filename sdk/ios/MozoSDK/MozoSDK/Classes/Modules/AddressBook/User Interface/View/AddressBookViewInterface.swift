//
//  AddressBookViewInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 10/2/18.
//

import Foundation

protocol AddressBookViewInterface {
    func showAddressBookDisplayData(_ data: AddressBookDisplayData, allItems: [AddressBookDisplayItem])
    func showNoContentMessage()
}
