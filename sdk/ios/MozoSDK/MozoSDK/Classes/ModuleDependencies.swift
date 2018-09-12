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
            apiManager.apiKey = apiKey
        }
    }
    
    let coreDataStore = CoreDataStore()
    let rootWireframe = RootWireframe()
    
    let walletWireframe = WalletWireframe()
    let authWireframe = AuthWireframe()
    
    let apiManager = ApiManager()
    
    // MARK: Initialization
    init() {
        apiKey = ""
        configureDependencies()
    }
    
    func installRootViewControllerIntoWindow(_ window: UIWindow) {
        authWireframe.presentInitialAuthInterface()
    }
    
    func authenticate() {
        authWireframe.presentInitialAuthInterface()
    }
    
    func configureDependencies() {
        // MARK: Auth
        authDependencies()
        // MARK: Wallet
        walletDependencies()
    }
    
    func authDependencies() {
        let authPresenter = AuthPresenter()
        
        let authManager = AuthManager()
        let anonymousManager = AnonManager(apiManager: apiManager)
        
        let authInteractor = AuthInteractor(authManager: authManager, anonManager: anonymousManager)
        authInteractor.output = authPresenter
        
        authPresenter.authInteractor = authInteractor
        authPresenter.authWireframe = authWireframe
        
        authWireframe.authPresenter = authPresenter
        authWireframe.rootWireframe = rootWireframe
    }
    
    func walletDependencies() {
        let walletPresenter = WalletPresenter()
        
        let walletManager = WalletManager()
        let walletDataManager = WalletDataManager()
        
        
        walletDataManager.coreDataStore = coreDataStore
        
        // TEST
        let userDataManager = UserDataManager()
        userDataManager.coreDataStore = coreDataStore
//        testWalletFlow(userDataManager: userDataManager)
//        testWalletFlow1(userDataManager: userDataManager)
        
        walletDataManager.getUserById("2")
            .done { (user) in
                print("User: [\(user)]")
            }.catch({ (error) in
                print("Error: [\(error)]")
            })
        apiManager.getUserProfile().catch { (error) in
            print("Error: [\(error)]")
        }
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
        profile?.userId = "1"
        profile?.walletInfo = "test pizza drift whip rebel empower flame mother service grace sweet kangaroo".encrypt(key: "000000")
        
        let user = UserDTO()
        user?.id = profile?.userId
        user?.profile = profile

        let userModel = UserModel(id: user?.id, mnemonic: nil, pin: nil, wallets: nil)
        _ = userDataManager.addNewUser(userModel)
        SessionStoreManager.saveCurrentUser(user: user!)
    }
    
    // User have no wallet before. -> create wallet
    func testWalletFlow1(userDataManager : UserDataManager){
        // Presiquites
        let profile = UserProfileDTO()
        profile?.userId = "2"
        
        let user = UserDTO()
        user?.id = profile?.userId
        user?.profile = profile
        
        let userModel = UserModel(id: user?.id, mnemonic: nil, pin: nil, wallets: nil)
        _ = userDataManager.addNewUser(userModel)
        SessionStoreManager.saveCurrentUser(user: user!)
    }
    
    // User have a local wallet before. -> do nothing
    func testWalletFlow2(){
//        testWalletFlow1()
    }
}
