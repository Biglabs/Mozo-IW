//
//  AddressBookPresenter.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation
class AddressBookPresenter : NSObject {
    var abInteractor : AddressBookInteractorInput?
    var abWireframe : AddressBookWireframe?
    var abModuleDelegate : AddressBookModuleDelegate?
    var abUserInterface: AddressBookViewInterface?
}
extension AddressBookPresenter : AddressBookModuleInterface {
    func selectAddressBookOnUI(_ addressBook: AddressBookDisplayItem) {
        abModuleDelegate?.addressBookModuleDidChooseItemOnUI(addressBook: addressBook)
    }
    func updateDisplayData() {
        abInteractor?.getListAddressBook()
    }
}
extension AddressBookPresenter: AddressBookInteractorOutput {
    func finishGetListAddressBook(_ addressBook: [AddressBookDTO]) {
        if addressBook.count > 0 {
            let collection = AddressBookDisplayCollection(items: addressBook)
            let data = collection.collectedDisplayData()
            abUserInterface?.showAddressBookDisplayData(data, allItems: collection.displayItems)
        } else {
            abUserInterface?.showNoContentMessage()
        }
    }
}
