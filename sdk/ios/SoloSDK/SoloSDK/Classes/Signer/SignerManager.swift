//
//  SignerManager.swift
//  Alamofire
//
//  Created by Tam Nguyen on 6/30/18.
//

import Foundation

public final class SignerManager {
    
    /// Signer application to use
    public var signerApp: SignerApp?
    public let bundleId: String!
    
    private var pendingCommand: Command?
    
    public init(bundleId: String) {
        self.bundleId = bundleId
        let url = URL.init(string: Configuration.SIGNER_APP_INSTALL_URL)!
        self.signerApp = SignerApp.init(name: Configuration.SIGNER_APP_NAME, scheme: Configuration.SIGNER_URL_SCHEME, installURL: url)
    }
    
    /// Handles an open URL callback
    ///
    /// - Returns: `true` is the URL was handled; `false` otherwise.
    public func handleCallback(url: URL) -> Bool {
        return pendingCommand?.handleCallback(url: url) ?? false
    }
    
    func execute(command: Command) {
        pendingCommand = command
        if let url = command.requestURL() {
            if #available(iOS 10.0, *) {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
            } else {
                UIApplication.shared.openURL(url)
            }
        } else {
            self.fallbackToInstall()
        }
    }
    
    func fallbackToInstall() {
        guard let app = signerApp else {
            return
        }
        
        if #available(iOS 10.0, *) {
            UIApplication.shared.open(app.installURL, options: [:], completionHandler: nil)
        } else {
            UIApplication.shared.openURL(app.installURL)
        }
    }
    
    /// Whether there is a signer app installed
    public var hasSignerApp: Bool {
        if let scheme = self.signerApp?.scheme {
            return UIApplication.shared.canOpenURL(URL(string: "\(scheme)://")!)
        }
        return false
    }
}
