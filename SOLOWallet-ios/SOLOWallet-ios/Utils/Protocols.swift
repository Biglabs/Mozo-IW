//
//  Protocols.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/22/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import SwiftyJSON

public protocol ResponseObjectSerializable: class {
    init?(json: JSON)
}
