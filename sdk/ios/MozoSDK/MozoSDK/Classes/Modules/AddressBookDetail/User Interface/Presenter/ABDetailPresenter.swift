//
//  ABDetailPresenter.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation
class ABDetailPresenter : NSObject {
    var detailInteractor : ABDetailInteractorInput?
    var detailWireframe : ABDetailWireframe?
    var detailModuleDelegate : ABDetailModuleDelegate?
    var detailUserInterface: ABDetailViewInterface?
}
extension ABDetailPresenter : ABDetailModuleInterface {
    func cancelSaveAction() {
        detailModuleDelegate?.detailModuleDidCancelSaveAction()
    }
    
    func saveAddressBookWithName(_ name: String, address: String) {
        detailUserInterface?.displaySpinner()
        detailInteractor?.saveAddressBookWithName(name, address: address)
    }
    
    func finishSaveAddressBook() {
        detailModuleDelegate?.detailModuleDidSaveAddressBook()
    }
}
extension ABDetailPresenter: ABDetailInteractorOutput {
    func errorWhileSaving(_ error: Error) {
        detailUserInterface?.removeSpinner()
        detailUserInterface?.displayError(error.localizedDescription)
    }
    func finishSaveWithSuccess() {
        detailUserInterface?.removeSpinner()
        detailUserInterface?.displaySuccess()
    }
}
