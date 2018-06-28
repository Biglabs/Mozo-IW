//
//  Constant.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation

public enum MediaType: String {
    case APPLICATION_JSON = "application/json"
    case APPLICATION_FORM_URLENCODED = "application/x-www-form-urlencoded"
}

public enum BackendError: Error {
    case network(error: Error) // Capture any underlying Error from the URLSession API
    case noInternetConnection
    case requestTimedOut
    case authenticationRequired
    case resourceNotFound
    case invalidStatusCode(String)
    case dataReturnedNil
    case customError(String)
    case confirmCodeRequired(error: Error)
    case invalidToken(String)
}

public enum COINTYPE {
    case BTC
    case ETH
    
    public var key : String {
        switch self {
        case .BTC: return "BTC"
        case .ETH: return "ETH"
        }
    }
    
    public var value : String {
        switch self {
        case .BTC: return "BTC"
        case .ETH: return "ETH"
        }
    }
    
    public var icon : String {
        switch self {
        case .BTC: return "ic_bitcoin"
        case .ETH: return "ic_ethereum"
        }
    }
}

public enum SOLOTAB {
    case Wallet
    case Receive
    case Exchange
    case Send
    
    public var key : String {
        switch self {
        case .Wallet: return "wallet"
        case .Receive: return "receive"
        case .Exchange: return "exchange"
        case .Send: return "send"
        }
    }
    
    public var value : String {
        switch self {
        case .Wallet: return "WALLET"
        case .Receive: return "RECEIVE"
        case .Exchange: return "EXCHANGE"
        case .Send: return "SEND"
        }
    }
    
    public var icon : String {
        switch self {
        case .Wallet: return "ic_wallet"
        case .Receive: return "ic_receive"
        case .Exchange: return "ic_exchange"
        case .Send: return "ic_send"
        }
    }
}

public enum WALLETACTION: String {
    case SIGN = "SIGN"
    case GET_WALLET = "GET_WALLET"
    case ADD_ADDRESS = "ADD_ADDRESS"
    case GET_BALANCE = "GET_BALANCE"
}

public enum SOLOACTION: String {
    case Dismiss = "dismiss"
    case Success = "success"
}

public enum SoloNotification: String {
    case Login   = "LOGIN"
    case Signed = "SIGNED"
}

public enum LOGINTYPE: String {
    case Login = "login"
    case Logout = "logout"
    case Success = "success"
    case Fail = "fail"
}
