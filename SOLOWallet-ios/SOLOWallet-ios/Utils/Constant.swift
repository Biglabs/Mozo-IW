//
//  Constant.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation

public enum CoinType {
    case BTC
    case ETH
    case MOZO
    
    public var key : String {
        switch self {
        case .BTC: return "BTC"
        case .ETH: return "ETH"
        case .MOZO: return "MOZO"
        }
    }
    
    public var value : String {
        switch self {
        case .BTC: return "BTC"
        case .ETH: return "ETH"
        case .MOZO: return "MOZO"
        }
    }
    
    public var icon : String {
        switch self {
        case .BTC: return "ic_BTC"
        case .ETH: return "ic_ETH"
        case .MOZO: return "ic_MOZO"
        }
    }
    
    public var scanName : String {
        switch self {
        case .BTC: return "bitcoin"
        case .ETH: return "ethereum"
        case .MOZO: return "mozo"
        }
    }
}

public enum SoloTab {
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

public enum SDKAction: String {
    case sign = "SIGN"
    case getWallet = "GET_WALLET"
    case addAddress = "ADD_ADDRESS"
    case getBalance = "GET_BALANCE"
    case refreshAddress = "REFRESH_ADDRESS"
    case refreshTxHistory = "REFRESH_TX_HISTORY"
    case generateReceiveQR = "GENERATE_RECEIVE_QR"
    case addMore = "ADD_MORE"
}

public enum EventType: String {
    case Dismiss = "dismiss"
    case Success = "success"
    case Fail = "fail"
}
