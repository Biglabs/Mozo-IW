//
//  ModuleDependencies.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/27/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit

class ModuleDependencies {
    // MARK: - Properties
    
    public var apiKey: String {
        didSet {
            
        }
    }
    
    var walletWireframe = WalletWireframe()
    
    // Initialization
    
    init() {
        apiKey = ""
        configureDependencies()
    }
    
    func installRootViewControllerIntoWindow(_ window: UIWindow) {
        walletWireframe.presentPassPhraseInterface()
    }
    
    func configureDependencies() {
        walletDependencies()
    }
    
    func walletDependencies() {
        let rootWireframe = RootWireframe()
        
        let walletPresenter = WalletPresenter()
        
        let walletManager = WalletManager()
        let walletDataManager = WalletDataManager()
        let walletInteractor = WalletInteractor(walletManager: walletManager, dataManager: walletDataManager)
        
        walletInteractor.output = walletPresenter
        
        walletPresenter.walletInteractor = walletInteractor
        walletPresenter.walletWireframe = walletWireframe
        
        walletWireframe.walletPresenter = walletPresenter
        walletWireframe.rootWireframe = rootWireframe
    }
}
