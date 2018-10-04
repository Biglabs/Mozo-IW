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
import PromiseKit

class ModuleDependencies {
    // MARK: - Properties
    
    public var apiKey: String {
        didSet {
            // Call API to check key
            apiManager.apiKey = apiKey
        }
    }
    
    public var network: MozoNetwork = .TestNet {
        didSet {
           
        }
    }
    
    let coreDataStore = CoreDataStore()
    let rootWireframe = RootWireframe()
    
    let coreWireframe = CoreWireframe()
    let walletWireframe = WalletWireframe()
    let authWireframe = AuthWireframe()
    let txWireframe = TransactionWireframe()
    let txhWireframe = TxHistoryWireframe()
    let txComWireframe = TxCompletionWireframe()
    let txDetailWireframe = TxDetailWireframe()
    let abDetailWireframe = ABDetailWireframe()
    let abWireframe = AddressBookWireframe()
    
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
        coreWireframe.requestForAuthentication()
    }
    
    func logout() {
        coreWireframe.requestForLogout()
    }
    
    func transferMozo() {
        coreWireframe.requestForTransfer()
    }
    
    func displayTransactionHistory() {
        coreWireframe.requestForTxHistory()
    }
    
    func loadBalanceInfo() -> Promise<DetailInfoDisplayItem>{
        return (coreWireframe.corePresenter?.coreInteractorService?.loadBalanceInfo())!
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
        transactionCompletionDependencies()
        transactionDetailDependencies()
        transactionHistoryDependencies()
        // MARK: Address book
        addressBookDependencies()
        addressBookDetailDependencies()
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
        corePresenter.coreInteractorService = coreInteractor
        corePresenter.coreWireframe = coreWireframe
        
        rootWireframe.mozoNavigationController.coreEventHandler = corePresenter
        
        coreWireframe.corePresenter = corePresenter
        coreWireframe.authWireframe = authWireframe
        coreWireframe.walletWireframe = walletWireframe
        coreWireframe.txWireframe = txWireframe
        coreWireframe.txhWireframe = txhWireframe
        coreWireframe.txCompleteWireframe = txComWireframe
        coreWireframe.txDetailWireframe = txDetailWireframe
        coreWireframe.abDetailWireframe = abDetailWireframe
        coreWireframe.abWireframe = abWireframe
        coreWireframe.rootWireframe = rootWireframe
    }
    
    func addressBookDetailDependencies() {
        let abdPresenter = ABDetailPresenter()
        
        let abdInteractor = ABDetailInteractor()
        abdInteractor.apiManager = apiManager
        abdInteractor.output = abdPresenter
        
        abdPresenter.detailInteractor = abdInteractor
        abdPresenter.detailWireframe = abDetailWireframe
        abdPresenter.detailModuleDelegate = coreWireframe.corePresenter
        
        abDetailWireframe.detailPresenter = abdPresenter
        abDetailWireframe.rootWireframe = rootWireframe
    }
    
    func addressBookDependencies() {
        let abPresenter = AddressBookPresenter()
        
        let abInteractor = AddressBookInteractor()
        abInteractor.output = abPresenter
        
        abPresenter.abInteractor = abInteractor
        abPresenter.abWireframe = abWireframe
        abPresenter.abModuleDelegate = coreWireframe.corePresenter
        
        abWireframe.abPresenter = abPresenter
        abWireframe.rootWireframe = rootWireframe
    }
    
    func transactionDetailDependencies() {
        txDetailWireframe.rootWireframe = rootWireframe
    }
    
    func transactionCompletionDependencies() {
        let txComPresenter = TxCompletionPresenter()
        
        txComPresenter.completionModuleDelegate = coreWireframe.corePresenter
        
        txComWireframe.txComPresenter = txComPresenter
        txComWireframe.rootWireframe = rootWireframe
    }
    
    func transactionHistoryDependencies() {
        let txhPresenter = TxHistoryPresenter()
        
        let txhInteractor = TxHistoryInteractor(apiManager: apiManager)
        txhInteractor.output = txhPresenter
        
        txhPresenter.txhInteractor = txhInteractor
        txhPresenter.txhWireframe = txhWireframe
        txhPresenter.txhModuleDelegate = coreWireframe.corePresenter
        
        txhWireframe.txhPresenter = txhPresenter
        txhWireframe.rootWireframe = rootWireframe
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
        txPresenter.transactionModuleDelegate = coreWireframe.corePresenter
        
        txWireframe.txPresenter = txPresenter
        txWireframe.rootWireframe = rootWireframe
    }
    
    func authDependencies() {
        let authPresenter = AuthPresenter()
        
        let authManager = AuthManager()
        authManager.apiManager = apiManager
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
        let privatekey = "b7643ad0c07b2f2a1232fc4d276c5554e05fa1c8fddb2aed738c7ae0526f5350"
        let result = "30440220742c8b23491f5560804bcb884cf1866a14598562819afe5fadd8c56a50c26fe5022030d2a9fe32c7f99a4f4adeb62442a360cdc2178f49f7f2907325c470a1d14d59"
        
        let signR : String? = tosign.ethSign(privateKey: privatekey)
        print("Sign result: \(signR)")
        
        let ts = "52204d20fd0131ae1afd173fd80a3a746d2dcc0cddced8c9dc3d61cc7ab6e966"
        let pk = "16f243e962c59e71e54189e67e66cf2440a1334514c09c00ddcc21632bac9808"
        let rs = "304402204019e4c591580b2a626beef77f92f21fb30e9c201c6a01ed6e7e6dcbf788ff56022074ae76e4f47a3c23dbaa930994a4f98c2cc1e03cb39c73fd8a246c16e2f3d1a8"
        
        let sr : String? = ts.ethSign(privateKey: pk)
        print("Sign result: \(sr)")
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
    
    func testSeedAndEncryption(manager: WalletManager) {
        for i in stride(from: 1, to: 11, by: 1) {
            print("\(i)-seed:")
            let mnemonic = manager.generateMnemonics()
            print(mnemonic ?? "")
            print("\(i)-seed encrypted:")
            print(mnemonic?.encrypt(key: "000000") ?? "")
            let wallet = manager.createNewWallet(mnemonics: mnemonic!)
            print("\(i)-privateKey:")
            print(wallet.privateKey)
            print("\(i)-privateKey encrypted:")
            print(wallet.privateKey.encrypt(key: "000000"))
        }
    }
    
    func testLocalData() {
        coreDataStore.getAllUsers()
    }
}
