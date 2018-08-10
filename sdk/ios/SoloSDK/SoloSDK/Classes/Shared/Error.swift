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
    case internalServerError
    case badRequest
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
        case .internalServerError:
            return "Internal Server error"
        case .badRequest:
            return "Bad request"
        }
    }
}
