//
//  SoloSDK.swift
//  SoloSDK
//
//  Created by Tam Nguyen on 6/29/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

//completion closure
public typealias completion = ((_ value: Any?, _ error: Error?) -> Void)?
public typealias completionProgress = ((_ value: Any?, _ progress: Progress?, _ error: Error?) -> Void)?

public final class SoloSDK: NSObject {
    
    public let api: RESTService?
    public let singner: SignerManager?
    public let autoStoreContentForOfflineUse: Bool = true
    
    public init(bundleId: String) {
        self.api = RESTService()
        self.singner = SignerManager(bundleId: bundleId)
    }
}
