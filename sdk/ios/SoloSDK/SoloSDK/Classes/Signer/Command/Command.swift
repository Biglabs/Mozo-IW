//
//  Command.swift
//  Alamofire
//
//  Created by Tam Nguyen on 6/30/18.
//

import Foundation

public protocol Command {
    
    /// Command name
    var name: String { get }
    
    /// Bundle Id
    var bundleId: String { get set }
    
    /// Singer request URL
    func requestURL() -> URL
    
    /// Handles a callback URL
    func handleCallback(url: URL) -> Bool
}
