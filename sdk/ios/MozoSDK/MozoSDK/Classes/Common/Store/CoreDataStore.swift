//
//  CoreDataStore.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/29/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import PromiseKit
import CoreStore

class CoreDataStore : NSObject {
    var stack : DataStack!
    
    override init() {
        super.init()
        let bundle = BundleManager.podBundle()
        stack = DataStack(
            xcodeModelName: "Mozo",
            bundle: bundle
        )
        let sqliteStore = SQLiteStore(
            fileName: "Mozo.sqlite",
            localStorageOptions: .recreateStoreOnModelMismatch // Provides settings that tells the DataStack how to setup the persistent store
        )
        do {
            try stack.addStorageAndWait(sqliteStore)
        } catch {
            print("Add storage error: [\(error)]")
        }
    }
    
    // MARK: User
    
    func countById(_ id: String) -> Int? {
        let count = stack.fetchCount(From<ManagedUser>().where(\.id == id))
        return count
    }
    
    func getUserById(_ id: String) -> Promise<UserModel>{
        return Promise { seal in
            if let userEntity = stack.fetchOne(From<ManagedUser>().where(\.id == id)) {
                print("Wallets count: [\(userEntity.wallets?.count ?? -1)]")
                let wallets : [WalletModel]? = userEntity.wallets?.map {
                    let wallet = $0 as! ManagedWallet
                    return WalletModel(address: wallet.address, privateKey: wallet.privateKey)
                }
                let userModel = UserModel(id: userEntity.id, mnemonic: userEntity.mnemonic, pin: userEntity.pin, wallets: NSSet(array: wallets!))
                seal.fulfill(userModel)
            } else {
                seal.reject(ConnectionError.unknowError)
            }
        }
    }

    func addNewUser(userModel: UserModel) -> Bool {
        do {
            _ = try stack.perform(synchronous: { (transaction) -> ManagedUser in
                let userEntity = transaction.create(Into<ManagedUser>())
                userEntity.id = userModel.id!
                return userEntity
            })
        } catch {
            print("Failed to add new user, error: [\(error)]")
            return false
        }
        return true
    }
    
    func newUser(userModel: UserModel) -> Promise<Any?>{
        return Promise { seal in
            stack.perform(asynchronous: { (transaction) -> ManagedUser in
                let userEntity = transaction.create(Into<ManagedUser>())
                userEntity.id = userModel.id!
                return userEntity
            }, success: { (userTransaction) in
                let newUser = self.stack.fetchExisting(userTransaction)!
                print("Success to add new user, id: [\(newUser.id)]")
                seal.fulfill(true)
            }, failure: { (csError) in
                print("Failed to add new user, error: [\(csError)]")
                seal.reject(csError)
            })
        }
    }
    
    func updateUser(_ userModel: UserModel) -> Promise<Any?>{
        return Promise { seal in
            stack.perform(asynchronous: { (transaction) -> ManagedUser in
                let userEntity = transaction.fetchOne(
                    From<ManagedUser>()
                        .where(\.id == userModel.id!)
                )
                userEntity?.mnemonic = userModel.mnemonic
                userEntity?.pin = userModel.pin
                
                return userEntity!
            }, success: { (userTransaction) in
                let newUser = self.stack.fetchExisting(userTransaction)!
                print("😁 Success to update user, mnemonic: [\(newUser.mnemonic ?? "")]")
                seal.fulfill(true)
            }, failure: { (csError) in
                print("😞 Failed to update user, error: [\(csError)]")
                seal.reject(csError)
            })
        }
    }
    
    // MARK: Wallet
    
    func updateWallet(_ walletModel: WalletModel, toUser id: String) -> Promise<Any?>{
        return Promise { seal in
            stack.perform(asynchronous: { (transaction) -> ManagedUser in
                let userEntity = transaction.fetchOne(
                    From<ManagedUser>()
                        .where(\.id == id)
                )
                let walletEntity = transaction.create(Into<ManagedWallet>())
                walletEntity.address = walletModel.address
                walletEntity.privateKey = walletModel.privateKey
                walletEntity.user = userEntity!
                
                userEntity?.wallets?.adding(walletEntity)
        
                return userEntity!
            }, success: { (userTransaction) in
                let newUser = self.stack.fetchExisting(userTransaction)!
                print("😁 Success to update wallet to user, wallet count: [\(newUser.wallets?.count ?? 0)]")
                seal.fulfill(true)
            }, failure: { (csError) in
                print("😞 Failed to update wallet to user, error: [\(csError)]")
                seal.reject(csError)
            })
        }
    }
    
    func getWalletByUserId(_ id: String) -> Promise<WalletModel>{
        return Promise { seal in
            if let userEntity = stack.fetchOne(From<ManagedUser>().where(\.id == id)) {
                print("Wallets count: [\(userEntity.wallets?.count ?? -1)]")
                let wallets : [WalletModel]? = userEntity.wallets?.map {
                    let wallet = $0 as! ManagedWallet
                    return WalletModel(address: wallet.address, privateKey: wallet.privateKey)
                }
                seal.fulfill((wallets?.first)!)
            } else {
                seal.reject(ConnectionError.unknowError)
            }
        }
    }
    
    func getAllUsers() {
        if let list = stack.fetchAll(From<ManagedUser>()) {
            print("User count: [\(list.count)]")
            for item in list {
                let userModel = UserModel(id: item.id, mnemonic: item.mnemonic, pin: item.pin, wallets: NSSet(array: []))
                print("User: \(userModel)")
                let wallets : [WalletModel]? = item.wallets?.map {
                    let wallet = $0 as! ManagedWallet
                    return WalletModel(address: wallet.address, privateKey: wallet.privateKey)
                }
                if let wallets = wallets {
                    for wallet in wallets {
                        print("Wallet: \(wallet)")
                    }
                }
            }
        } else {
            
        }
    }
}

