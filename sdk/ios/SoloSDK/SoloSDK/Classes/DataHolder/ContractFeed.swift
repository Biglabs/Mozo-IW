//
//  ContractFeed.swift
//  SoloSDK
//
//  Created by Hoang Nguyen on 8/9/18.
//

import SwiftyJSON

public class ContractFeed: ContentFeed {
    public private(set) var contracts: [ContractDTO]?
    private var soloSDK: SoloSDK!
    private var network: String!
    
    public init(_ id: String, network: String, soloSDK: SoloSDK) {
        super.init(id)
        self.soloSDK = soloSDK
        self.network = network
    }
    
    override public func reset(){
        super.reset()
        self.contracts = nil
    }
    
    override public func getContent() -> Any? {
        return self.contracts
    }
    
    public override func loadContent(contentAndErrorCompletion: @escaping (Any?, Error?) -> ()){
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        self.soloSDK?.api?.getAllTokenContracts(network) { value, error in
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            guard let value = value, error == nil else {
                contentAndErrorCompletion(nil, error)
                return
            }
            
            //Success
            DispatchQueue.global(qos: DispatchQoS.QoSClass.background).async {
                let json = SwiftyJSON.JSON(value)
                
                var items = [ContractDTO]()
                if let arr = json.array {
                    items = arr.filter({ ContractDTO(json: $0) != nil }).map({ ContractDTO(json: $0)! })
                }
                if items.count > 0 {
                    self.contracts = items
                }
                contentAndErrorCompletion(self.contracts, nil)
            }
        }
    }
}
