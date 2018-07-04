//
//  Configuration.swift
//  Alamofire
//
//  Created by Tam Nguyen on 6/30/18.
//

import Foundation

public class Configuration {
    // Signer app config
    public static var SIGNER_APP_NAME = "SOLOSigner"
    public static var SIGNER_APP_INSTALL_URL = "itms-apps://itunes.apple.com/app/id"
    public static var SIGNER_URL_SCHEME = "solosigner"
    
    // Wallet config
    public static var WALLET_URL_SCHEME = "solowallet"
    
    //development
    public static var BASE_URL = "http://192.168.1.98:9000"
    public static var ROPSTEN_INFURA_URL = "https://ropsten.infura.io/V2vOGBNVvlHlDJQ17sIL"
    public static var COIN_MARKET_CAP_URL = "https://api.coinmarketcap.com/v2/ticker"
    public static var BLOCK_CYPHER_TEST_URL = "https://api.blockcypher.com/v1/btc/test3/"
}
