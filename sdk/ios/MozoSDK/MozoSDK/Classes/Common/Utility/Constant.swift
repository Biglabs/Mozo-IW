//
//  Constant.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/19/18.
//

import Foundation

public enum CoinType {
    case BTC
    case ETH
    case MOZO_ONCHAIN
    case MOZO_OFFCHAIN
    
    public var key : String {
        switch self {
            case .BTC: return "BTC"
            case .ETH: return "ETH"
            case .MOZO_ONCHAIN: return "MOZO_ONCHAIN"
            case .MOZO_OFFCHAIN: return "MOZO_OFFCHAIN"
        }
    }
    
    public var value : String {
        switch self {
            case .BTC: return "BTC"
            case .ETH: return "ETH"
            case .MOZO_ONCHAIN: return "MOZO_ONCHAIN"
            case .MOZO_OFFCHAIN: return "MOZO_OFFCHAIN"
        }
    }
    
    public var icon : String {
        switch self {
            case .BTC: return "ic_BTC"
            case .ETH: return "ic_ETH"
            case .MOZO_ONCHAIN: return "ic_MOZO"
            case .MOZO_OFFCHAIN: return "ic_MOZO_OFFCHAIN"
        }
    }
    
    public var scanName : String {
        switch self {
            case .BTC: return "bitcoin"
            case .ETH: return "ethereum"
            case .MOZO_ONCHAIN: return "mozo_onchain"
            case .MOZO_OFFCHAIN: return "mozo_offchain"
        }
    }
}

public enum Module {
    case Auth
    case Wallet
    case Transaction
    
    public var key : String {
        switch self {
            case .Auth: return "Auth"
            case .Wallet: return "Wallet"
            case .Transaction: return "Transaction"
        }
    }
    
    public var value : String {
        switch self {
            case .Auth: return "Auth"
            case .Wallet: return "Wallet"
            case .Transaction: return "Transaction"
        }
    }
}

public enum BalanceDisplayType {
    case NormalBalance
    case DetailBalance
    case Full
    case NormalAddress
    case DetailAddress

    public var id : String {
        switch self {
        case .NormalBalance: return "MozoBalanceView"
        case .DetailBalance: return "MozoBalanceDetailView"
        case .Full: return "MozoBalanceDetailQRView"
        case .NormalAddress: return "MozoAddressView"
        case .DetailAddress: return "MozoAddressDetailView"
        }
    }
    
    public var anonymousId : String {
        switch self {
        case .NormalBalance: return "MozoBalanceLoginView"
        case .DetailBalance: return "MozoAddressDetailLoginView"
        case .Full: return "MozoBalanceDetailQRLoginView"
        case .NormalAddress: return "MozoAddressLoginView"
        case .DetailAddress: return "MozoBalanceDetailQRLoginView"
        }
    }
}

public enum TransactionType {
    case Sent
    case Received
    
    public var value : String {
        switch self {
        case .Sent: return "Sent"
        case .Received: return "Received"
        }
    }
}

public enum MozoNetwork {
    case TestNet
    case MainNet
    
    public var value : String {
        switch self {
        case .TestNet: return "TestNet"
        case .MainNet: return "MainNet"
        }
    }
}

public enum CurrencyType: String {
    case USD = "USD"
    case KRW = "KRW"
    
    public var decimalRound: Int {
        switch self {
        case .USD: return 3
        case .KRW: return 1
        }
    }
}

public enum SymbolType {
    case SOLO
    case MOZO
    
    public var value : String {
        switch self {
        case .SOLO: return "SOLO"
        case .MOZO: return "MOZO"
        }
    }
}
