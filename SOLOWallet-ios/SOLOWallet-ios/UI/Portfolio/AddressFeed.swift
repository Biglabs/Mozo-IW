//
//  AddressFeed.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/27/18.
//  Copyright © 2018 biglabs. All rights reserved.
//


import SoloSDK
import SwiftyJSON

public class AddressFeed: ContentFeed {
    public private(set) var addressess: [AddressDTO]?
    private var soloSDK: SoloSDK!
    
    public init(_ id: String, soloSDK: SoloSDK) {
        super.init(id)
        self.soloSDK = soloSDK
    }
    
    override public func reset(){
        super.reset()
        self.addressess = nil
    }
    
    override public func getContent() -> Any? {
        return self.addressess
    }
    
    public override func loadContent(contentAndErrorCompletion: @escaping (Any?, Error?) -> ()){
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.getAddresses(id) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                if let backendError = error {
                    Utils.showError(backendError)
                }
                return
            }
            
            //Success
            DispatchQueue.global(qos: DispatchQoS.QoSClass.background).async {
                let json = SwiftyJSON.JSON(value)
                
                var items = [AddressDTO]()
                if let arr = json.array {
                    items = arr.filter({ AddressDTO(json: $0) != nil }).map({ AddressDTO(json: $0)! })
                }
                if items.count > 0 {
                    self.addressess = items
                }
                DispatchQueue.main.async {
                    contentAndErrorCompletion(self.addressess, nil)
                    
                }
            }
        }
    }
}
