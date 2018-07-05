import {icCoinBtc, icCoinEth, icCoinMozo, icCoinSolo} from '../res/icons';

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
            icon: icCoinBtc
        },
        BTC_TEST: {
            displayName: "BTC TESTNET",
            name: "BTC",
            value: 1,
            network: "BTC_TEST",
            icon: icCoinBtc
        },
        ETH: {
            displayName: "ETH",
            name: "ETH",
            value: 60,
            network: "ETH_MAIN",
            icon: icCoinEth
        },
        ETH_TEST: {
            displayName: "ETH TESTNET",
            name: "ETH",
            value: 60,
            network: "ETH_TEST",
            icon: icCoinEth
        },
        SOLO: {
            displayName: "SOLO",
            name: "SOLO",
            value: "Constract's Address",
            icon: icCoinSolo
        },
        MOZO: {
            displayName: "MOZO",
            name: "MOZO",
            value: "Constract's Address",
            icon: icCoinMozo
        }
    },
    ERROR_TYPE:{
        UNKNOWN: -1,
	    NONE: 0,
	    CANCELLED: 1,
        INVALID_REQUEST: 2,
        WATCH_ONLY: 3
    },
    FLAG_DB_EXISTING: '@DbExisting:key',
    FLAG_PUBLIC_KEY: '@publicKey:key',
    FLAG_SCHEME_DATA: '@schemeData:key',
    FLAG_ADDRESS_SYNC: '@addressSync:key',
};

const DEFAULT_COINS = [Constants.COIN_TYPE.BTC, Constants.COIN_TYPE.BTC_TEST, Constants.COIN_TYPE.ETH];

Constants.DEFAULT_COINS = DEFAULT_COINS;

module.exports = Constants;