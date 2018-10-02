//
//  AddressBookDisplaySection.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 10/2/18.
//

import Foundation

struct AddressBookDisplaySection {
    let sectionName : String
    var items : [AddressBookDisplayItem] = []
}

extension AddressBookDisplaySection : Equatable {
    static func == (leftSide: AddressBookDisplaySection, rightSide: AddressBookDisplaySection) -> Bool {
        return rightSide.items == leftSide.items
    }
}
