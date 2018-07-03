package com.biglabs.solo.blockcypher;

/**
 * Created by antt on 6/27/2018.
 */
//@Component
public class BCYContext {
    public static final String BLOCK_CYPHER_ENDPOINT = "https://api.blockcypher.com";
    public static final String VERSION_V1 = "v1";
    public static final String CURRENCY_BTC = "btc";
    public static final String CURRENCY_LTC = "ltc";
    public static final String CURRENCY_DOGE = "doge";
    public static final String CURRENCY_BCY = "bcy";
    public static final String NETWORK_MAIN = "main";
    public static final String NETWORK_BTC_TESTNET = "test3";
    public static final String NETWORK_BCY_TESTNET = "test";

    public String getVersion() {
        return version;
    }

    public BlockCypherProperties.EndPointConfig getCoininfo() {
        return coininfo;
    }

    public String getToken() {
        return token;
    }

    private final String version;
    private final BlockCypherProperties.EndPointConfig coininfo;
    private final String token;

    public BCYContext(String version, BlockCypherProperties.EndPointConfig endPointConfig, String token) {
        this.version = version;
        this.coininfo = endPointConfig;
        this.token = token;
    }


}
