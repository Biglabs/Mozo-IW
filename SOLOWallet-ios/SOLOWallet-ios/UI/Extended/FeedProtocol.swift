//
//  FeedProtocol.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/27/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import AsyncDisplayKit

public protocol FeedProtocol: class {
    func isShimmering(_ shimmeringNode: ASDisplayNode!) -> Bool
    func errorFetching() -> Error!
    func isZeroData() -> Bool
    func isHasMore() -> Bool
    func isInProgress() -> Bool
}

extension FeedProtocol {
    
    func isShimmering(_ shimmeringNode: ASDisplayNode!) -> Bool {
        return true
    }
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
