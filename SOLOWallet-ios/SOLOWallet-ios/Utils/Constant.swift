//
//  Constant.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation

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
        case .Wallet: return "Wallet"
        case .Receive: return "Receive"
        case .Exchange: return "Exchange"
        case .Send: return "Send"
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
