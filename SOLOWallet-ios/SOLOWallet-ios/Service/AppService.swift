//
//  AppService.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/22/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SwiftyJSON
import MMDrawerController

public class AppService {
    public static let shared = AppService()
    private init() {}
    
    public var tokenValid = true
    
    public func handleReceivedUrlFromWalletApp(jsonData: String){
        guard let jsonStr = jsonData.removingPercentEncoding else {
            print("handleReceivedUrlFromWalletApp: jsonData is nil")
            return
        }
        let data = SwiftyJSON.JSON.init(parseJSON: jsonStr)
        let com = CommunicationDTO(json: data)
        if let action = com?.action {
            switch action {
            case ACTIONTYPE.GET_WALLET.value:
                if let result = com?.result {
                    let wallet = WalletDTO(json: result)
                    if let walletId = wallet?.walletId {
                        //Save walletId
                        UserDefaults.standard.set(walletId, forKey: KeychainKeys.WALLLET_ID)
                        //refresh
                        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate,
                            let drawerController = appDelegate.drawerController else {return}
                        drawerController.portfolioVC.createTableView()
                    }
                }
                break
            case ACTIONTYPE.ADD_ADDRESS.value:
                break
            case ACTIONTYPE.SIGN.value:
                if let result = com?.result {
                    let value = TransactionDTO(json: result)
                    if let signedTransaction = value?.signedTransaction {
                        self.sendTx(signedTx: signedTransaction)
                    }
                }
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
            if let result = json["result"].string {
                print("TxId: \(result)")
                //Open browser to view transaction info
                let url = URL(string: "http://ropsten.etherscan.io/tx/\(result)")
                UIApplication.shared.open(url!, options: [:], completionHandler: nil)
            }
            
        }
    }
    
    public func launchSignerApp(_ action: String, coinType: String, transaction: TransactionDTO?) {
        let isAlwaysLaunchApp = KeychainService.instance.getBool(KeychainKeys.ALWAYS_LAUNCH_SOLO_SIGNER_APP)
        
        func launchApp() {
            if let bundleId = Bundle.main.bundleIdentifier {
                var urlStr = Configuration.URL_SCHEME_SIGNER + "://"
                let model = CommunicationDTO(action: action, receiver: "\(bundleId).\(Configuration.URL_SCHEME_WALLET)", params: transaction, coinType: coinType)
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
