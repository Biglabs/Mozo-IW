//
//  AbstractViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import MMDrawerController

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
        let address = AddressDTO.init(id: "123", address: "017A16QmavnUfCW11DAApiJxp7ARnxN5pGX", coin: "ETH", balance: 7.020020030, network: "ETH_MAIN", transactions: transactions as? [TransactionDTO])
        coin = CoinDTO.init(id: 0, key: "ETH", name: "ETH", icon: "ic_ethereum", addesses: [address!])
        
        let titleLabel = UILabel.init()
        titleLabel.font = UIFont.boldSystemFont(ofSize: 16)
        titleLabel.textColor = ThemeManager.shared.title
        titleLabel.addTextWithImage(text: " \(coin.name!)", image: UIImage.init(named: coin.icon!)!, imageBehindText: false, keepPreviousText: false)
        self.navigationController?.parent?.navigationController?.navigationItem.titleView = titleLabel
        
    }
 
    @objc open func rightDrawerButtonPress(_ sender: Any? = nil) {
        print(self.mm_drawerController)
        self.mm_drawerController?.bouncePreview(for: MMDrawerSide.right) { _ in }
    }
    
    
    
    open func refresh(_ sender: Any? = nil) {}
}
