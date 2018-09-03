//
//  BundleManager.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/3/18.
//

import Foundation

public class BundleManager {
    public static func podBundle() -> Bundle {
        return Bundle.init(for: MozoSDK.self)
    }
    
    public static func mozoBundle() -> Bundle {
        let podBundle = self.podBundle()
        
        let bundleURL = podBundle.url(forResource: "MozoSDK", withExtension: "bundle")
        let bundle = Bundle.init(url: bundleURL!)!
        return bundle
    }
}
