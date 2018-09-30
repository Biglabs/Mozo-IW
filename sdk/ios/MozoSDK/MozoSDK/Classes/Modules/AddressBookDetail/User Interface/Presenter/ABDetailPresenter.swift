//
//  ABDetailPresenter.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation
class ABDetailPresenter : NSObject {
    var detailInteractor : ABDetailInteractor?
    var detailWireframe : ABDetailWireframe?
    var detailModuleDelegate : ABDetailModuleDelegate?
}
extension ABDetailPresenter : ABDetailModuleInterface {
    func cancelSaveAction() {
        detailWireframe?.dismissDetailInterface()
        detailModuleDelegate?.detailModuleDidCancelSaveAction()
    }
    
    func detailSaveActionWithName(_ name: String, address: String) {
        detailInteractor?.saveNewABWithName(name, address: address)
        detailWireframe?.dismissDetailInterface()
        detailModuleDelegate?.detailModuleDidSaveAction()
    }
}
