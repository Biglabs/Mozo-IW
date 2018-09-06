//
//  ManagedUser.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/29/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import CoreData

public class ManagedUser : NSManagedObject {
    @NSManaged var id : String
    @NSManaged var mnemonic : String?
    @NSManaged var pin : String?
    @NSManaged var wallets: NSSet?
}
