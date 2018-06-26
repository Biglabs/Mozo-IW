//
//  AppService.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/22/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

public class AppService {
    public static let shared = AppService()
    private init() {}
    
    public var tokenValid = true
    
    public func launchWalletApp(){
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate,
            let URL = appDelegate.url else {return}
        print("scheme: \(String(describing: URL.scheme))" )
        
        // do something
        
        //destroy call signer after handle
        appDelegate.url = nil
        appDelegate.sourceApplication = nil
    }
    
    public func launchSignerApp(_ action: String, type: String, transaction: TransactionDTO) {
        let isAlwaysLaunchApp = KeychainService.instance.getBool(KeychainKeys.ALWAYS_LAUNCH_SOLO_SIGNER_APP)
        
        func launchApp() {
            if let bundleId = Bundle.main.bundleIdentifier {
                var urlStr = Configuration.URL_SCHEME_SIGNER + "://"
                let model = CommunicationDTO(action: action, receiver: "\(bundleId).\(Configuration.URL_SCHEME_WALLET)", params: transaction, type: type)
                urlStr += (model?.rawString())!
                print("URL: [\(urlStr)]")
                
                if let url = URL(string : urlStr.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)!), UIApplication.shared.canOpenURL(url as URL) {
                    if #available(iOS 10.0, *) {
                        UIApplication.shared.open(url, options: ["":""], completionHandler: nil)
                    } else {
                        UIApplication.shared.openURL(url)
                    }
                } else {
                    //https://itunes.apple.com/us/app/{biglabs}/{id}?ls=1&mt=8
                    if #available(iOS 10.0, *) {
                        UIApplication.shared.open(URL(string: "itms-apps://itunes.apple.com/app/{id}")!, options: ["":""], completionHandler: nil)
                    } else {
                        UIApplication.shared.openURL(URL(string: "itms-apps://itunes.apple.com/app/{id}")!)
                    }
                }
            }
        }
        
        if isAlwaysLaunchApp == true {
            launchApp()
        } else {
            let alertController = UIAlertController(title: "Launch the Signer Apps", message: nil, preferredStyle: .alert)
            let justOnceAction = UIAlertAction(title: "Just Once", style: .default) { _ in
                KeychainService.instance.setBool(KeychainKeys.ALWAYS_LAUNCH_SOLO_SIGNER_APP, value: false)
                launchApp()
            }
            alertController.addAction(justOnceAction)
            
            let alwaysAction = UIAlertAction(title: "Always", style: .default) { _ in
                KeychainService.instance.setBool(KeychainKeys.ALWAYS_LAUNCH_SOLO_SIGNER_APP, value: true)
                launchApp()
            }
            alertController.addAction(alwaysAction)
            
            let cancelAction = UIAlertAction(title: "Cancel", style: .cancel, handler: nil)
            alertController.addAction(cancelAction)
            Utils.getTopViewController().present(alertController, animated: true, completion: nil)
        }
    }
}
