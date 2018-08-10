//
//  AddressFeed.swift
//  SoloSDK
//
//  Created by Tam Nguyen on 6/27/18.
//  Copyright © 2018 biglabs. All rights reserved.
//


import SwiftyJSON

public class AddressFeed: ContentFeed {
    public private(set) var addresses: [AddressDTO]?
    private var soloSDK: SoloSDK!
    
    public init(_ id: String, soloSDK: SoloSDK) {
        super.init(id)
        self.soloSDK = soloSDK
    }
    
    override public func reset(){
        super.reset()
        self.addresses = nil
    }
    
    override public func getContent() -> Any? {
        return self.addresses
    }
    
    public override func loadContent(contentAndErrorCompletion: @escaping (Any?, Error?) -> ()){
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.getAddresses(id) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                contentAndErrorCompletion(nil, error)
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
                    self.addresses = items
                }
                DispatchQueue.main.async {
                    contentAndErrorCompletion(self.addresses, nil)
                    
                }
            }
        }
    }
}
