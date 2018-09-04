//
//  ManagedWallet.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/29/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import CoreData

public class ManagedWallet : NSManagedObject {
    @NSManaged var address : String?
    @NSManaged var privateKey : String?
    @NSManaged var user : ManagedUser?
}
