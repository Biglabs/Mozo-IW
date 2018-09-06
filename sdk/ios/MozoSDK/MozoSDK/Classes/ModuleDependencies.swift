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
            // Call API to check key
        }
    }
    
    var walletWireframe = WalletWireframe()
    
    // Initialization
    
    init() {
        apiKey = ""
        configureDependencies()
    }
    
    func installRootViewControllerIntoWindow(_ window: UIWindow) {
        walletWireframe.presentInitialWalletInterface()
    }
    
    func configureDependencies() {
        // MARK: Wallet
        walletDependencies()
    }
    
    func walletDependencies() {
        let coreDataStore = CoreDataStore()
        let rootWireframe = RootWireframe()
        
        let walletPresenter = WalletPresenter()
        
        let walletManager = WalletManager()
        let walletDataManager = WalletDataManager()
        let apiManager = ApiManager()
        
        walletDataManager.coreDataStore = coreDataStore
        
        // TEST
        let userDataManager = UserDataManager()
        userDataManager.coreDataStore = coreDataStore
        testWalletFlow(userDataManager: userDataManager)
        // TEST
        
        let walletInteractor = WalletInteractor(walletManager: walletManager, dataManager: walletDataManager, apiManager: apiManager)
        
        walletInteractor.output = walletPresenter
        
        walletPresenter.walletInteractor = walletInteractor
        walletPresenter.walletWireframe = walletWireframe
        
        walletWireframe.walletPresenter = walletPresenter
        walletWireframe.rootWireframe = rootWireframe
    }
    
    // User have a wallet before. -> restore wallet
    func testWalletFlow(userDataManager : UserDataManager){
        // Presiquites
        let profile = UserProfileDTO()
        profile?.id = "1"
        profile?.wallet = "test pizza drift whip rebel empower flame mother service grace sweet kangaroo".encrypt(key: "000000")
        
        let user = UserDTO()
        user?.id = profile?.id
        user?.profile = profile
        
        let userModel = UserModel(id: user?.id, mnemonic: nil, pin: nil, wallets: nil)
        userDataManager.addNewUser(userModel)
        SessionStoreManager.saveCurrentUser(user: user!)
    }
    
    // User have no wallet before. -> create wallet
    func testWalletFlow1(){
        // Presiquites
        let profile = UserProfileDTO()
        profile?.id = "1"
        
        let user = UserDTO()
        user?.id = profile?.id
        user?.profile = profile
        
        SessionStoreManager.saveCurrentUser(user: user!)
    }
    
    // User have a local wallet before. -> do nothing
    func testWalletFlow2(){
        testWalletFlow1()
    }
}
