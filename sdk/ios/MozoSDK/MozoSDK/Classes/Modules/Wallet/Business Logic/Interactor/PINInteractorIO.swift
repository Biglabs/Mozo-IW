//
//  PINInteractorIO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation


protocol PINInteractorInput {
    func savePIN(pin: String)
    func verifyPIN(rawPIN: String)
}

protocol PINInteractorOutput {
    func pinVerificationResult(result: Bool)
}
