const Constants = {
    ACTION_SCHEME: {
        NONE: "NONE",
        GET_WALLET: "GET_WALLET",
        SIGN: "SIGN",
        ADD_ADDRESS: "ADD_ADDRESS"
    },
    COIN_TYPE: {
        BTC: {
            displayName: "BTC",
            name: "BTC",
            value: 0,
            network: "BTC_MAIN",
            icon: require("../res/icons/ic_coin_btc.svg")
        },
        BTC_TEST: {
            displayName: "BTC TESTNET",
            name: "BTC",
            value: 1,
            network: "BTC_TEST",
            icon: require("../res/icons/ic_coin_btc.svg")
        },
        ETH: {
            displayName: "ETH",
            name: "ETH",
            value: 60,
            network: "ETH_MAIN",
            icon: require("../res/icons/ic_coin_eth.svg")
        },
        ETH_TEST: {
            displayName: "ETH TESTNET",
            name: "ETH",
            value: 60,
            network: "ETH_TEST",
            icon: require("../res/icons/ic_coin_eth.svg")
        },
        SOLO: {
            displayName: "SOLO",
            name: "SOLO",
            value: "Constract's Address",
            icon: require("../res/icons/ic_coin_solo.svg")
        },
        MOZO: {
            displayName: "MOZO",
            name: "MOZO",
            value: "Constract's Address",
            icon: require("../res/icons/ic_coin_mozo.svg")
        }
    },
    FLAG_DB_EXISTING: '@DbExisting:key',
    FLAG_PUBLIC_KEY: '@publicKey:key',
    FLAG_SCHEME_DATA: '@schemeData:key',
    FLAG_ADDRESS_SYNC: '@addressSync:key',
};

const DEFAULT_COINS = [Constants.COIN_TYPE.BTC, Constants.COIN_TYPE.BTC_TEST, Constants.COIN_TYPE.ETH];

Constants.DEFAULT_COINS = DEFAULT_COINS;

module.exports = Constants;