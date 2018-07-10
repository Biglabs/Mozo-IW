//
//  Error.swift
//  SoloSDK
//
//  Created by Tam Nguyen on 6/29/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation

public enum ConnectionError: Error {
    case network(error: Error)
    case noInternetConnection
    case requestTimedOut
    case requestNotFound
    case unknowError
    case authenticationRequired
}

extension ConnectionError: LocalizedError {
    public var errorDescription: String? {
        switch self {
        case .network:
            return "Network error"
        case .noInternetConnection:
            return "No Internet Connection"
        case .requestTimedOut:
            return "The request timed out"
        case .requestNotFound:
            return "404 Not Found"
        case .unknowError:
            return "Unknow error"
        case .authenticationRequired:
            return "Authentication Required"
        }
    }
}

public enum SignerError: Int {
    /// Unknown Error
    case unknown = -1
    
    /// No Error occurred
    case none = 0
    
    /// Error occour when the user cancel transacion signing request.
    case cancelled = 1
    
    /// Error generated when address(es) is invalid.
    case invalidAddress = 2
    
    /// Error generated when current signer is watch only
    case watchOnly = 3
}

extension SignerError: LocalizedError {
    public var errorDescription: String? {
        switch self {
        case .unknown:
            return "Unknown Error"
        case .none:
            return "No Error"
        case .cancelled:
            return "User cancelled"
        case .invalidAddress:
            return "Signing request is invalid"
        case .watchOnly:
            return "Signer is watch only"
        }
    }
}
