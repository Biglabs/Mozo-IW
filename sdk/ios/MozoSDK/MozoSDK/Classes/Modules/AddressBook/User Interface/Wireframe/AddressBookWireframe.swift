//
//  AddressBookWireframe.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation

class AddressBookWireframe : MozoWireframe {
    var abPresenter : AddressBookPresenter?
    var addressBookViewController : AddressBookViewController?
    
    func presentAddressBookInterface() {
        let viewController = viewControllerFromStoryBoard(AddressBookViewControllerIdentifier) as! AddressBookViewController
        viewController.eventHandler = abPresenter
        addressBookViewController = viewController
        
        abPresenter?.abUserInterface = viewController
        rootWireframe?.displayViewController(viewController)
    }
    
    func dismissAddressBookInterface() {
        rootWireframe?.dismissTopViewController()
    }
}
