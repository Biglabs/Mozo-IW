//
//  ContentFeed.swift
//  SoloSDK
//
//  Created by Tam Nguyen on 6/27/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import SwiftyJSON

open class ContentFeed: NSObject, FeedProtocol {
    open var id: String!
    open var refreshInProgress: Bool = false
    open var fetchInProgress: Bool = false
    open var error: Error!
    open var zeroData = false
    
    override public init() {
        super.init()
        self.reset()
    }
    
    public init(_ id: String!) {
        super.init()
        self.id = id
        self.reset()
    }
    
    open func reset(){
        self.fetchInProgress = false
        self.zeroData = false
        self.error = nil
    }
    
    public func errorFetching() -> Error! {
        return self.error
    }
    
    public func isZeroData() -> Bool {
        return self.zeroData
    }
    
    public func isHasMore() -> Bool {
        return true
    }
    
    public func isInProgress() -> Bool {
        return self.fetchInProgress
    }
    
    open func getContent() -> Any? {
        return nil
    }
    
    open func refresh(completion: @escaping (Any?, Error?) -> ()){
        if self.refreshInProgress == true { return }
        self.refreshInProgress = true
        self.reset()
        self.fetchContent(contentAndErrorCompletion: completion)
    }
    
    
    open func fetchContent(contentAndErrorCompletion: @escaping (Any?, Error?) -> ()) {
        
        guard !fetchInProgress else { return }
        
        fetchInProgress = true
        self.loadContent() { [unowned self] content, error in
            if self.refreshInProgress == true {
                self.refreshInProgress = false
            }
            self.fetchInProgress = false
            
            if self.getContent() == nil {
                self.zeroData = true
            } else {
                self.zeroData = false
            }
            
            contentAndErrorCompletion(content, error)
        }
    }
    
    open func loadContent(contentAndErrorCompletion: @escaping (Any?, Error?) -> ()){
    }
}
