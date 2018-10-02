//
//  AddressBookDisplayData.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 10/2/18.
//

import Foundation

struct AddressBookDisplayData {
    let sections : [AddressBookDisplaySection]
}

extension AddressBookDisplayData : Equatable {
    static func == (leftSide: AddressBookDisplayData, rightSide: AddressBookDisplayData) -> Bool {
        return rightSide.sections == leftSide.sections
    }
}
