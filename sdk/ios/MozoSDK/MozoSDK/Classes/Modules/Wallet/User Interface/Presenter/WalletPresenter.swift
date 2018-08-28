//
//  WalletPresenter.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit

class WalletPresenter : NSObject, PINInteractorOutput {
    var pinInteractor : PINInteractorInput?
    var walletWireframe : WalletWireframe?
    var pinUserInterface : PINViewInterface?
    
    // MARK: PINInteractorOutput
    
    func pinVerificationResult(result: Bool) {
        
    }
}
