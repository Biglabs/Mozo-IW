//
//  ABDetailInteractorIO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 10/1/18.
//

import Foundation
protocol ABDetailInteractorInput {
    func saveAddressBookWithName(_ name: String, address: String)
}

protocol ABDetailInteractorOutput {
    func finishSaveAddressBook()
    func errorWhileSaving(_ error: Error)
}
