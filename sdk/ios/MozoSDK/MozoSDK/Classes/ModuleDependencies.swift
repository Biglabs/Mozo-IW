//
//  ModuleDependencies.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/27/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit
import SwiftyJSON

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
    
    let coreWireframe = CoreWireframe()
    let walletWireframe = WalletWireframe()
    let authWireframe = AuthWireframe()
    let txWireframe = TransactionWireframe()
    
    let apiManager = ApiManager()
    
    // MARK: Initialization
    init() {
        apiKey = ""
        configureDependencies()
    }
    
    func setAuthDelegate(_ delegate: AuthenticationDelegate) {
        coreWireframe.corePresenter?.authDelegate = delegate
    }
    
    func authenticate() {
        testSign()
        coreWireframe.requestForAuthentication()
    }
    
    func logout() {
        coreWireframe.requestForLogout()
    }
    
    func transferMozo() {
        coreWireframe.requestForTransfer()
    }
    
    func configureDependencies() {
        // MARK: Core
        coreDependencies()
        // MARK: Auth
        authDependencies()
        // MARK: Wallet
        walletDependencies()
        // MARK: Transaction
        transactionDependencies()
    }
    
    func coreDependencies() {
        let corePresenter = CorePresenter()
        
        let anonManager = AnonManager()
        anonManager.apiManager = apiManager
        let userDataManager = UserDataManager()
        userDataManager.coreDataStore = coreDataStore
        
        let coreInteractor = CoreInteractor(anonManager: anonManager, apiManager: apiManager, userDataManager: userDataManager)
        coreInteractor.output = corePresenter
        
        corePresenter.coreInteractor = coreInteractor
        corePresenter.coreWireframe = coreWireframe
        
        coreWireframe.corePresenter = corePresenter
        coreWireframe.authWireframe = authWireframe
        coreWireframe.walletWireframe = walletWireframe
        coreWireframe.txWireframe = txWireframe
        coreWireframe.rootWireframe = rootWireframe
    }
    
    func transactionDependencies() {
        let txPresenter = TransactionPresenter()
        
        let txInteractor = TransactionInteractor(apiManager: apiManager)
        txInteractor.output = txPresenter
        
        let txDataManager = TransactionDataManager()
        txDataManager.coreDataStore = coreDataStore
        txInteractor.signManager = TransactionSignManager(dataManager: txDataManager)
        
        txPresenter.txInteractor = txInteractor
        txPresenter.txWireframe = txWireframe
        
        txWireframe.walletWireframe = walletWireframe
        txWireframe.txPresenter = txPresenter
        txWireframe.rootWireframe = rootWireframe
    }
    
    func authDependencies() {
        let authPresenter = AuthPresenter()
        
        let authManager = AuthManager()
        let authInteractor = AuthInteractor(authManager: authManager)
        authInteractor.output = authPresenter
        
        authPresenter.authInteractor = authInteractor
        authPresenter.authWireframe = authWireframe
        authPresenter.authModuleDelegate = coreWireframe.corePresenter
        
        authWireframe.authPresenter = authPresenter
        authWireframe.rootWireframe = rootWireframe
    }
    
    func walletDependencies() {
        let walletPresenter = WalletPresenter()
        
        let walletManager = WalletManager()
        let walletDataManager = WalletDataManager()
        walletDataManager.coreDataStore = coreDataStore
        
        let walletInteractor = WalletInteractor(walletManager: walletManager, dataManager: walletDataManager, apiManager: apiManager)
        walletInteractor.output = walletPresenter
        
        walletPresenter.walletInteractor = walletInteractor
        walletPresenter.walletWireframe = walletWireframe
        walletPresenter.walletModuleDelegate = coreWireframe.corePresenter
        
        walletWireframe.walletPresenter = walletPresenter
        walletWireframe.rootWireframe = rootWireframe
    }
    
    func testSign() {
        let tosign = "3e7c8671c98af65e4f957d0843a15ce0616a0624cc5fbc3e6f72b7871f118ac1"
        let privatekey = "0xb7643ad0c07b2f2a1232fc4d276c5554e05fa1c8fddb2aed738c7ae0526f5350"
        let result = "30440220742c8b23491f5560804bcb884cf1866a14598562819afe5fadd8c56a50c26fe5022030d2a9fe32c7f99a4f4adeb62442a360cdc2178f49f7f2907325c470a1d14d59"
        
        let signR : String? = tosign.ethSign(privateKey: privatekey)
        print("Sign result: \(signR)")
    }
    
    func testUpdateProfile() {
        let testStr = "{\"id\":1251,\"userId\":\"bbf400f4-cae1-40fa-88d1-a0faafaf12c9\",\"status\" : \"CONFIRMED\",\"exchangeInfo\" : null,\"walletInfo\" : null,\"settings\" : null}"
        let json = SwiftyJSON.JSON(testStr)
        let profile = UserProfileDTO(json: json)
        let walletInfo = WalletInfoDTO(encryptSeedPhrase: "", offchainAddress: "")
        profile?.walletInfo = walletInfo
        
        _ = apiManager.updateUserProfile(userProfile: profile!)
            .done { uProfile -> Void in
                print("Update Wallet To User Profile result: [\(uProfile)]")
        }
    }
}
