//
//  FeedProtocol.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/27/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation

public protocol FeedProtocol: class {
    
    func errorFetching() -> Error!
    func isZeroData() -> Bool
    func isHasMore() -> Bool
    func isInProgress() -> Bool
}

extension FeedProtocol {
    
    func errorFetching() -> Error! {
        return nil
    }
    
    func isZeroData() -> Bool {
        return false
    }
    
    func isHasMore() -> Bool {
        return true
    }
    
    func isInProgress() -> Bool {
        return false
    }
}
