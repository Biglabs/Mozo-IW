//
//  SignerApp.swift
//  Alamofire
//
//  Created by Tam Nguyen on 6/30/18.
//

import Foundation

/// Describes a signer app supporting the trust deeplink spec
public struct SignerApp {
    /// Signer app name
    var name: String
    
    /// App URL scheme
    var scheme: String
    
    /// App install URL
    var installURL: URL
}
