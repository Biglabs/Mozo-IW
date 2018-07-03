//
//  CoinmarketcapAPI.swift
//  Alamofire
//
//  Created by Tam Nguyen on 7/3/18.
//

import Foundation

public extension RESTService {
    // https://coinmarketcap.com/api/#endpoint_ticker_specific_cryptocurrency
    public func getTickerId(_ id: String, completionHandler: completion = nil) {
        let url = Configuration.COIN_MARKET_CAP_URL + "/\(id)"
        return self.execute(.get, url: url, completionHandler: completionHandler)
    }
}
