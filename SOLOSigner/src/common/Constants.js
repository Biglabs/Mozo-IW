const Constants = {
    ACTION_SCHEME : {
        NONE: "NONE",
        GET_WALLET: "GET_WALLET",
        SIGN: "SIGN",
        ADD_ADDRESS: "ADD_ADDRESS"
    },
    COIN_TYPE: {
        BTC: { name: "BTC", value: 1, network: "BTC_TEST" },
        ETH: { name: "ETH", value: 60, network: "ETH_TEST" },
        SOLO: { name: "SOLO", value: "Constract's Address" }
    },
    FLAG_DB_EXISTING: '@DbExisting:key',
    FLAG_PUBLIC_KEY: '@publicKey:key',
    FLAG_SCHEME_DATA: '@schemeData:key',
    FLAG_ADDRESS_SYNC: '@addressSync:key',
};

module.exports = Constants;