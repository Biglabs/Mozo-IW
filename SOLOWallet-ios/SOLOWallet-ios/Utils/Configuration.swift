//
//  Configuration.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation

public class Configuration {
    public static let DEBUG = false
    public static let KEYCHAIN_SERVICE_NAME = "com.biglabs.solowallet.auth"
    public static let KEYCHAIN_ACCESS_GROUP_NAME = ""
    public static let OAUTH_CLIENT_ID = ""
    public static let OAUTH_SECRET = ""
    public static let GRANT_TYPE = "password"
    public static let MIN_PASSWORD_LENGTH = 4
    public static var FONT_SIZE: UIFontTextSize = UIFontTextSize(.xSmall)
    public static var URL_SCHEME_SIGNER = "solosigner"
    public static var URL_SCHEME_WALLET = "solowallet"
    public static let DEVICE_TOKEN = "DEVICE_TOKEN"
    //Wallet
    public static let WALLLET_ID = "WalletId"
    
    //development
    public static var BASE_URL = "http://192.168.1.98:9000"
    public static var ROPSTEN_ETHERSCAN_URL = "http://ropsten.etherscan.io/tx"
    public static var ROPSTEN_INFURA_URL = "https://ropsten.infura.io/V2vOGBNVvlHlDJQ17sIL"
    public static var BLOCK_CYPHER_SCAN_URL = "https://live.blockcypher.com/btc-testnet/tx"
    
    public static func getDomain() -> String?{
        let URL = NSURL(string: self.BASE_URL)
        let domain = URL?.host
        return domain
    }
}
