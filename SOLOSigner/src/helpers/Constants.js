import {icCoinBtc, icCoinEth, icCoinMozo, icCoinSolo} from '../res/icons/index';

const Constants = {
    SATOSHI_UNIT: 100000000,
    WEI_UNIT: 1000000000000000000,
    CONFIRM_TIME_OUT: 1000, // 1 minute by default
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
        UNKNOWN: {},
        NONE: {},
        NO_WALLET_INFO: {
            code: "ERR-001",
            title: "Offline - Wallet info not found",
            detail: "User are in offline mode, there is no wallet info at this time.",
            type: "Infrastructure & Business"
        },
	    CANCEL_REQUEST: {
            code: "ERR-002",
            title: "User cancel request.",
            detail: "User click cancel button or back button.",
            type: "Business"
        },
        TIME_OUT_CONFIRM: {
            code: "ERR-003",
            title: "Timeout confirmation",
            detail: "User wait too long for confirmation.",
            type: "Business"
        },
        INVALID_ADDRESS: {
            code: "ERR-004",
            title: "Invalid address",
            detail: "Address(es) is not created by Signer.",
            type: "Business"
        },
    },
    FLAG_DB_EXISTING: '@DbExisting:key',
    FLAG_PUBLIC_KEY: '@publicKey:key',
    FLAG_SCHEME_DATA: '@schemeData:key',
    FLAG_ADDRESS_SYNC: '@addressSync:key',
    FLAG_BACKUP_WALLET: '@backupWallet:key',
    FLAG_CONFIRM_TIME_OUT: '@confirmTimeout:key'
};

const DEFAULT_COINS = [Constants.COIN_TYPE.BTC, Constants.COIN_TYPE.BTC_TEST, Constants.COIN_TYPE.ETH];

Constants.DEFAULT_COINS = DEFAULT_COINS;

module.exports = Constants;