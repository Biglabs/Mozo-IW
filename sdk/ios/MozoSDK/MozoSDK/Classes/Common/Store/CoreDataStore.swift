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
    // MARK: Core Data stack
//    lazy var applicationDocumentsDirectory: URL = {
//        // The directory the application uses to store the Core Data store file. This code uses a directory named "self.com.AG.TaskIt" in the application's documents Application Support directory.
//        let domains = FileManager.SearchPathDomainMask.userDomainMask
//        let directory = FileManager.SearchPathDirectory.documentDirectory
//
//        let applicationDocumentsDirectory = FileManager.default.urls(for: directory, in: domains).first!
//        return applicationDocumentsDirectory
//    }()
//    lazy var managedObjectModel : NSManagedObjectModel = {
//        // The managed object model for the application. This property is not optional. It is a fatal error for the application not to be able to find and load its model.
//        let bundle = BundleManager.podBundle()
//        let modelURL = bundle.url(forResource: "Mozo", withExtension: "momd")!
//        return NSManagedObjectModel(contentsOf: modelURL)!
//    }()
    
//    lazy var persistentStoreCoordinator : NSPersistentStoreCoordinator? = {
//        // The persistent store coordinator for the application. This implementation creates and return a coordinator, having added the store for the application to it. This property is optional since there are legitimate error conditions that could cause the creation of the store to fail.
//        // Create the coordinator and store
//        var coordinator: NSPersistentStoreCoordinator? = NSPersistentStoreCoordinator(managedObjectModel: self.managedObjectModel)
//
//        let options = [NSMigratePersistentStoresAutomaticallyOption : true, NSInferMappingModelAutomaticallyOption : true]
//
//        let storeURL = applicationDocumentsDirectory.appendingPathComponent("Mozo.sqlite")
//
//        try! coordinator?.addPersistentStore(ofType: NSSQLiteStoreType, configurationName: "", at: storeURL, options: options)
//        return coordinator
//    }()
//
//    lazy var managedObjectContext: NSManagedObjectContext? = {
//        // Returns the managed object context for the application (which is already bound to the persistent store coordinator for the application.) This property is optional since there are legitimate error conditions that could cause the creation of the context to fail.
//        let coordinator = self.persistentStoreCoordinator
//        if coordinator == nil {
//            return nil
//        }
//        let managedObjectContext = NSManagedObjectContext(concurrencyType: NSManagedObjectContextConcurrencyType.mainQueueConcurrencyType)
//        managedObjectContext.persistentStoreCoordinator = coordinator
//        return managedObjectContext
//    }()
    
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
    
    func countById(_ id: String) -> Int? {
        let count = stack.fetchCount(From<ManagedUser>().where(\.id == id))
        return count
    }
    
    func getUserById(_ id: String) -> Promise<UserModel>{
        return Promise { seal in
            if let userEntity = stack.fetchOne(From<ManagedUser>().where(\.id == id)) {
                let wallets = userEntity.wallets?.map {
                    let wallet = $0 as! ManagedWallet
                    _ = WalletModel(address: wallet.address, privateKey: wallet.privateKey)
                }
                let userModel = UserModel(id: userEntity.id, mnemonic: userEntity.mnemonic, pin: userEntity.pin, wallets: NSSet(array: wallets!))
                seal.fulfill(userModel)
            } else {
                seal.reject(ConnectionError.unknowError)
            }
        }
    }
    
//    func fetchEntriesWithPredicate(_ predicate: NSPredicate, completionBlock: (([ManagedUser]) -> Void)!) {
//        let fetchRequest: NSFetchRequest<NSFetchRequestResult>  = NSFetchRequest(entityName: "User")
//        fetchRequest.predicate = predicate
//
//        mainContext.perform {
//            do {
//                let queryResults = try self.mainContext.fetch(fetchRequest)
//                let managedResults = queryResults as! [ManagedUser]
//                completionBlock(managedResults)
//            } catch {
//                print("Fetch users with predicate error: [\(error)]")
//            }
//        }
//    }
//
//    func fetchWallets(completionBlock: (([ManagedWallet]) -> Void)!) {
//        let fetchRequest: NSFetchRequest<NSFetchRequestResult>  = NSFetchRequest(entityName: "Wallet")
//
//        mainContext.perform {
//            let queryResults = try? self.mainContext.fetch(fetchRequest)
//            let managedResults = queryResults as! [ManagedWallet]
//            completionBlock(managedResults)
//        }
//    }
//
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
//
//    func newWallet() -> ManagedWallet {
//        let newEntry = NSEntityDescription.insertNewObject(forEntityName: "Wallet", into: mainContext) as! ManagedWallet
//
//        return newEntry
//    }
    
//    func save() throws {
//        do {
//            try mainContext.save()
//        } catch {
//            print("Core data save error: [\(error.localizedDescription)]")
//            throw error
//        }
//    }
}

