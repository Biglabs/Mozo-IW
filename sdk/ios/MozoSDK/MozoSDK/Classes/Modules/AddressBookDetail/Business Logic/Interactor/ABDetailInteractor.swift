//
//  ABDetailInteractor.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation

class ABDetailInteractor : NSObject {
    var apiManager : ApiManager?
    var output: ABDetailInteractorOutput?
}

extension ABDetailInteractor: ABDetailInteractorInput {
    func saveAddressBookWithName(_ name: String, address: String) {
        let model = AddressBookDTO(name: name, address: address)
        _ = apiManager?.updateAddressBook(model, isCreateNew: true).done({ (addressBook) in
            SessionStoreManager.addressBookList.append(addressBook!)
            self.output?.finishSaveAddressBook()
        }).catch({ (error) in
            self.output?.errorWhileSaving(error)
        })
    }
}
