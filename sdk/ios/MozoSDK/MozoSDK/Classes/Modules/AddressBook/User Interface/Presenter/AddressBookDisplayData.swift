//
//  AddressBookDisplayData.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 10/2/18.
//

import Foundation

struct AddressBookDisplayData {
    let sections : [AddressBookDisplaySection]
    
    public func filterByText(_ text: String) -> [AddressBookDisplaySection] {
        var filteredSections : [AddressBookDisplaySection] = []
        for section in sections {
            let filteredItems = section.items.filter({( item : AddressBookDisplayItem) -> Bool in
                let contain = item.name.lowercased().contains(text.lowercased())
                return contain
            })
            if filteredItems.count > 0 {
                let rSection = AddressBookDisplaySection(sectionName: section.sectionName, items: filteredItems)
                filteredSections.append(rSection)
            }
        }
        return filteredSections
    }
}

extension AddressBookDisplayData : Equatable {
    static func == (leftSide: AddressBookDisplayData, rightSide: AddressBookDisplayData) -> Bool {
        return rightSide.sections == leftSide.sections
    }
}
