//
//  AddressBookInteractor.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation

class AddressBookInteractor: NSObject {
    var output: AddressBookInteractorOutput?
    
    
}
extension AddressBookInteractor : AddressBookInteractorInput {
    func getListAddressBook() {
        output?.finishGetListAddressBook(SessionStoreManager.addressBookList)
    }
}
