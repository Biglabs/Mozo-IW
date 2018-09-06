//
//  CoreDataStore.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/29/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import CoreData

class CoreDataStore : NSObject {
    // MARK: - Core Data stack
    lazy var applicationDocumentsDirectory: URL = {
        // The directory the application uses to store the Core Data store file. This code uses a directory named "self.com.AG.TaskIt" in the application's documents Application Support directory.
        let domains = FileManager.SearchPathDomainMask.userDomainMask
        let directory = FileManager.SearchPathDirectory.documentDirectory
        
        let applicationDocumentsDirectory = FileManager.default.urls(for: directory, in: domains).first!
        return applicationDocumentsDirectory
    }()
    lazy var managedObjectModel : NSManagedObjectModel = {
        // The managed object model for the application. This property is not optional. It is a fatal error for the application not to be able to find and load its model.
        let bundle = BundleManager.podBundle()
        let modelURL = bundle.url(forResource: "Mozo", withExtension: "momd")!
        return NSManagedObjectModel(contentsOf: modelURL)!
    }()
    
    lazy var persistentStoreCoordinator : NSPersistentStoreCoordinator? = {
        // The persistent store coordinator for the application. This implementation creates and return a coordinator, having added the store for the application to it. This property is optional since there are legitimate error conditions that could cause the creation of the store to fail.
        // Create the coordinator and store
        var coordinator: NSPersistentStoreCoordinator? = NSPersistentStoreCoordinator(managedObjectModel: self.managedObjectModel)
        
        let options = [NSMigratePersistentStoresAutomaticallyOption : true, NSInferMappingModelAutomaticallyOption : true]
        
        let storeURL = applicationDocumentsDirectory.appendingPathComponent("Mozo.sqlite")
        
        try! coordinator?.addPersistentStore(ofType: NSSQLiteStoreType, configurationName: "", at: storeURL, options: options)
        return coordinator
    }()
    
    lazy var managedObjectContext: NSManagedObjectContext? = {
        // Returns the managed object context for the application (which is already bound to the persistent store coordinator for the application.) This property is optional since there are legitimate error conditions that could cause the creation of the context to fail.
        let coordinator = self.persistentStoreCoordinator
        if coordinator == nil {
            return nil
        }
        let managedObjectContext = NSManagedObjectContext(concurrencyType: NSManagedObjectContextConcurrencyType.mainQueueConcurrencyType)
        managedObjectContext.persistentStoreCoordinator = coordinator
        return managedObjectContext
    }()
    
    override init() {
        super.init()
    }
    
    func fetchEntriesWithPredicate(_ predicate: NSPredicate, completionBlock: (([ManagedUser]) -> Void)!) {
        let fetchRequest: NSFetchRequest<NSFetchRequestResult>  = NSFetchRequest(entityName: "User")
        fetchRequest.predicate = predicate
        
        managedObjectContext?.perform {
            let queryResults = try? self.managedObjectContext?.fetch(fetchRequest)
            let managedResults = queryResults! as! [ManagedUser]
            completionBlock(managedResults)
        }
    }
    
    func fetchWallets(completionBlock: (([ManagedWallet]) -> Void)!) {
        let fetchRequest: NSFetchRequest<NSFetchRequestResult>  = NSFetchRequest(entityName: "Wallet")
        
        managedObjectContext?.perform {
            let queryResults = try? self.managedObjectContext?.fetch(fetchRequest)
            let managedResults = queryResults! as! [ManagedWallet]
            completionBlock(managedResults)
        }
    }
    
    func newUser() -> ManagedUser {
        let newEntry = NSEntityDescription.insertNewObject(forEntityName: "User", into: managedObjectContext!) as! ManagedUser
        
        return newEntry
    }
    
    func newWallet() -> ManagedWallet {
        let newEntry = NSEntityDescription.insertNewObject(forEntityName: "Wallet", into: managedObjectContext!) as! ManagedWallet
        
        return newEntry
    }
    
    func save() {
        do {
            try managedObjectContext?.save()
        } catch {
            print("Core data save error: [\(error)]")
        }
    }
}
