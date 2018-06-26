//
//  AppService.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/22/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SwiftyJSON

public class AppService {
    public static let shared = AppService()
    private init() {}
    
    public var tokenValid = true
    
    public func handleReceivedUrlFromWalletApp(jsonData: String){
        let jsonStr = jsonData.removingPercentEncoding
        let data = SwiftyJSON.JSON.init(parseJSON: jsonStr!)
        let com = CommunicationDTO(json: data)
        print(data)
        if let action = com?.action {
            switch action {
            case ACTIONTYPE.GET_WALLET.value:
                let wallet = WalletDTO(json: (com?.result)!)
                //Save walletId
                KeychainService.shared.setString(KeychainKeys.WALLLET_ID, value: wallet?.walletId)
                break
            case ACTIONTYPE.ADD_ADDRESS.value:
                break
            case ACTIONTYPE.SIGN.value:
                let value = TransactionDTO(json: (com?.result)!)
                print(value)
                sendTx(signedTx: (value?.signedTransaction)!)
                break
            default:
                break
            }
        }
    }

    private func sendTx(signedTx: String){
        let params = ["jsonrpc": "2.0", "id": 1, "method": "eth_sendRawTransaction", "params": [signedTx]] as [String : Any]
        RESTService.shared.infuraPOST(params) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let backendError = error {
                    Utils.showError(backendError)
                }
                return
            }
            
            let json = SwiftyJSON.JSON(value)
            print(json["result"])
            if let result = json["result"].string {
                print(result)
            }
            
        }
    }
    
    //action: view,create
    //type: idea,space,...
    public func launchSignerApp(_ action: String, type: String, transaction: TransactionDTO?) {
        let isAlwaysLaunchApp = KeychainService.instance.getBool(KeychainKeys.ALWAYS_LAUNCH_SOLO_SIGNER_APP)
        
        func launchApp() {
            if let bundleId = Bundle.main.bundleIdentifier {
                var urlStr = Configuration.URL_SCHEME_SIGNER + "://"
                let model = CommunicationDTO(action: action, receiver: "\(bundleId).\(Configuration.URL_SCHEME_WALLET)", params: transaction, type: type)
                urlStr += (model?.rawString())!
                print("URL: [\(urlStr)]")
                
                if let url = URL(string : urlStr.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)!)
                    //,UIApplication.shared.canOpenURL(url as URL)
                {
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
