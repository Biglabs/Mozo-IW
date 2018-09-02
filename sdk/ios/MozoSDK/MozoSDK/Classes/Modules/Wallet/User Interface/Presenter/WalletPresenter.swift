//
//  WalletPresenter.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit

class WalletPresenter : NSObject {
    var walletInteractor : WalletInteractor?
    var walletWireframe : WalletWireframe?
    var pinUserInterface : PINViewInterface?
    var passPharseUserInterface : PassPhraseViewInterface?
}

extension WalletPresenter: WalletModuleInterface {
    func generateMnemonics() {
        walletInteractor?.generateMnemonics()
    }
}

extension WalletPresenter: WalletInteractorOutput {
    func pinVerificationResult(result: Bool) {
        
    }
    
    func generatedMnemonics(mnemonic: String) {
        passPharseUserInterface?.showPassPhrase(passPharse: mnemonic)
    }
}
