//
//  AppDelegate.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SoloSDK
import CoreData
import MMDrawerController

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var drawerController: MMDrawerController?
    var soloSDK: SoloSDK!
    
    func application(_ application: UIApplication, willFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey : Any]? = nil) -> Bool {
        
        self.window = UIWindow(frame: UIScreen.main.bounds)
        
        guard let bundleId = Bundle.main.bundleIdentifier else {
            // do something when bundle Id is nil
            let errorVC = UIViewController()
            window?.rootViewController = errorVC
            return true
        }
        
        /// Instantiate the SoloSDK with the scheme registered for this app
        self.soloSDK = SoloSDK(bundleId: bundleId)
        
        let centerViewController = PortfolioViewController()
        centerViewController.soloSDK = self.soloSDK
        let rightViewController = DrawerMenuViewController()
        
        let rightSideNav = UINavigationController(rootViewController: rightViewController)
        rightSideNav.restorationIdentifier = "SOLO_RightViewController"
        
        let centerNav = UINavigationController(rootViewController: centerViewController)
        centerNav.restorationIdentifier = "SOLO_CenterViewController"
        
        drawerController = MMDrawerController.init(center: centerNav, rightDrawerViewController: rightViewController)!
        
        drawerController?.openDrawerGestureModeMask = MMOpenDrawerGestureMode.panningNavigationBar
        drawerController?.closeDrawerGestureModeMask = MMCloseDrawerGestureMode.all
        drawerController?.restorationIdentifier = "MMDrawer"
        let width = UIScreen.main.bounds.width * 0.85
        drawerController?.maximumRightDrawerWidth = width
        drawerController?.maximumLeftDrawerWidth = width
        window?.rootViewController = drawerController
        ThemeManager.applyTheme()
        self.window!.makeKeyAndVisible()
        
        return true
    }
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        /// Handle signer results
        if let url = launchOptions?[.url] as? URL {
            if let singner = self.soloSDK.singner {
                return singner.handleCallback(url: url)
            }
        }
        return true
    }
    
    func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {
        //com.hdwallet.solowallet://{"action":"GET_WALLET","result":{"uuid":"1141234","email":"user1@gmail.com"}}
//        let urls = url.absoluteString.components(separatedBy: "://")
//        if urls.count > 0 {
//            let jsonData = urls[1]
//            AppService.shared.handleReceivedUrlFromWalletApp(jsonData: jsonData)
//        }
        /// Handle signer results
        return self.soloSDK.singner?.handleCallback(url: url) ?? false
    }
    
    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
        // Saves changes in the application's managed object context before the application terminates.
        self.saveContext()
    }

    // MARK: - Core Data stack

    lazy var persistentContainer: NSPersistentContainer = {
        /*
         The persistent container for the application. This implementation
         creates and returns a container, having loaded the store for the
         application to it. This property is optional since there are legitimate
         error conditions that could cause the creation of the store to fail.
        */
        let container = NSPersistentContainer(name: "SOLOWallet_ios")
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                 
                /*
                 Typical reasons for an error here include:
                 * The parent directory does not exist, cannot be created, or disallows writing.
                 * The persistent store is not accessible, due to permissions or data protection when the device is locked.
                 * The device is out of space.
                 * The store could not be migrated to the current model version.
                 Check the error message to determine what the actual problem was.
                 */
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        })
        return container
    }()

    // MARK: - Core Data Saving support

    func saveContext () {
        let context = persistentContainer.viewContext
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                let nserror = error as NSError
                fatalError("Unresolved error \(nserror), \(nserror.userInfo)")
            }
        }
    }

    // implemented in your application delegate
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        print("RegisterForRemoteNotifications. Got token data! \(deviceToken.deviceToken)")
        KeychainService.instance.setString(KeychainKeys.DEVICE_TOKEN, value: deviceToken.deviceToken)
    }
    
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("RegisterForRemoteNotifications. Couldn't register: \(error)")
    }
    
    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any]) {
        //let aps = userInfo["aps"] as! [String: AnyObject]
        //The app was running and in the foreground, the push notification called this method
        
        print("didReceiveRemoteNotification, userInfo: \(userInfo)")
        
        switch application.applicationState {
        case .active:
            //app is currently active, can update badges count here
            break
            
        case .inactive:
            //app is transitioning from background to foreground (user taps notification), do what you need when user taps here
            break
            
        case .background:
            //app is in background, if content-available key of your notification is set to 1, poll to your backend to retrieve data and update your interface here
            break
        }
    }
}

