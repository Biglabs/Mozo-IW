//
//  AbstractViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import MMDrawerController
import SwiftyJSON

//dummy data
let transactions = [TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0),
                    TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0),
                    TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0),
                    TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0),
                    TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0),
                    TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0),
                    TransactionDTO.init(id: "119bb1f73f029248c22479a9e4fa57c5c62d9dadfdf728fa0a4a02a887d8aac8", time: 1415637900, from: "17A16QmavnUfCW11DAApiJxp7ARnxN5pGX", to: "1Hd8td3NnWbsqZVdEBvtd8ko4WcJf7jwCE", value: 0.0088, fee: 0)
]

public class AbstractViewController: UIViewController {
    fileprivate var logoBarButton: UIBarButtonItem!
    fileprivate var menuBarButton: UIBarButtonItem!
    
    var coin: CoinDTO!
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor = ThemeManager.shared.background
        
        //dummy data
        let address = AddressDTO.init(id: "123", address: "0x011df24265841dCdbf2e60984BB94007b0C1d76A", coin: "ETH", balance: 0, network: "ETH_MAIN", transactions: transactions as? [TransactionDTO])
        coin = CoinDTO.init(id: 0, key: "ETH", name: "ETH", icon: "ic_ethereum", addesses: [address!])
        
//        let titleLabel = UILabel.init()
//        titleLabel.font = UIFont.boldSystemFont(ofSize: 16)
//        titleLabel.textColor = ThemeManager.shared.title
//        titleLabel.addTextWithImage(text: " \(coin.name!)", image: UIImage.init(named: coin.icon!)!, imageBehindText: false, keepPreviousText: false)
//        self.navigationController?.navigationBar.topItem?.titleView = titleLabel
        guard let walletId = UserDefaults.standard.string(forKey: KeychainKeys.WALLLET_ID) else {
            return
        }
        self.getAddresses(walletId)
    }
    
    func getAddresses(_ walletId: String, completionHandler completion: ((Bool) -> Swift.Void)? = nil){
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        RESTService.shared.getAddresses(walletId) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let backendError = error {
                    Utils.showError(backendError)
                }
                if let completionHandler = completion {
                    completionHandler(false)
                }
                return
            }
            //Success
            if let address = self.coin.addresses?.first?.address {
                let json = SwiftyJSON.JSON(value)
                var items = [AddressDTO]()
                if let arr = json.array {
                    items = arr.filter({ AddressDTO(json: $0) != nil }).map({ AddressDTO(json: $0)! })
                }
                if items.count > 0 {
                    self.coin.addresses?.insert(items.first!, at: 0)
                }
                self.getBalance(address, completionHandler: { (result) in
                    if let completionHandler = completion {
                        completionHandler(result)
                    }
                });
            }
        }
    }
    
    func getBalance(_ address: String, completionHandler completion: ((Bool) -> Swift.Void)? = nil) {
        let params = ["jsonrpc": "2.0", "id": 1, "method": "eth_getBalance", "params": [address,"latest"]] as [String : Any]
        RESTService.shared.infuraPOST(params) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let backendError = error {
                    Utils.showError(backendError)
                }
                if let completionHandler = completion {
                    completionHandler(false)
                }
                return
            }
            
            let json = SwiftyJSON.JSON(value)
            if let result = json["result"].string {
                var amount = Double(result)
                //ETH
                amount = amount!/1E+18
                self.coin.addresses?.first?.balance = amount ?? 0
                self.refresh()
                if let completionHandler = completion {
                    completionHandler(true)
                }
            }
            
        }
    }
    
    open func refresh(_ sender: Any? = nil) {}
}
