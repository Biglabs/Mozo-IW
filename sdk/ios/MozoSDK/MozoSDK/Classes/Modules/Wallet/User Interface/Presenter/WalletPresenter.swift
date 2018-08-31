//
//  WalletPresenter.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit

class WalletPresenter : NSObject, WalletInteractorOutput {
    var walletInteractor : WalletInteractor?
    var walletWireframe : WalletWireframe?
    var pinUserInterface : PINViewInterface?
    
    // MARK: WalletInteractorOutput
    
    func pinVerificationResult(result: Bool) {
        
    }
}

extension WalletPresenter: WalletModuleInterface {
    func generateMnemonics() {
        walletInteractor?.generateMnemonics()
    }
}
