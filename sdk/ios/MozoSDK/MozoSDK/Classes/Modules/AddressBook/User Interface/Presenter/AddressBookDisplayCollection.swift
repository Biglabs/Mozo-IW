//
//  AddressBookDisplayCollection.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 10/2/18.
//

import Foundation
class AddressBookDisplayCollection {
    var displayItems : [AddressBookDisplayItem]
    
    init(items: [AddressBookDTO]) {
        displayItems = []
        for item in items {
            let displayItem = AddressBookDisplayItem(name: item.name!, address: item.soloAddress!)
            displayItems.append(displayItem)
        }
    }
    
    func collectedDisplayData() -> AddressBookDisplayData {
        let collectedSections : [AddressBookDisplaySection] = sortedAddressBookDisplaySections()
        return AddressBookDisplayData(sections: collectedSections)
    }
    
    func sortedAddressBookDisplaySections() -> [AddressBookDisplaySection] {
        var displaySections : [AddressBookDisplaySection] = []
        let sortedItems = displayItems.sorted { $0.name < $1.name }
        
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        for char in characters {
            let prefix = String(char)
            let filteredArr = sortedItems.filter() { $0.name.hasPrefix(prefix, caseSensitive: true) }
            let section = AddressBookDisplaySection(sectionName: prefix, items: filteredArr)
            displaySections.append(section)
        }
        
        return displaySections
    }
}
