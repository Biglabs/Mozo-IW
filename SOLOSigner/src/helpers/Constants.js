import {Platform} from "react-native";
import RNFileSystem from "react-native-fs";
import {icCoinBtc, icCoinEth, icCoinMozo, icCoinSolo} from '../res/icons';

const defaultPath = Platform.select({
    ios: RNFileSystem.DocumentDirectoryPath,
    android: `${RNFileSystem.ExternalStorageDirectoryPath}/Documents`
});

const Constants = {
    SATOSHI_UNIT: 100000000,
    WEI_UNIT: 1000000000000000000,
    CONFIRM_TIME_OUT: 60, // 1 minute by default
    ACTION_SCHEME: {
        NONE: "NONE",
        GET_WALLET: "GET_WALLET",
        SIGN: "SIGN",
        MANAGE_WALLET: "MANAGE_WALLET"
    },
    BACKUP_FILE_TYPE: {
        PNG: "png",
        TXT: "txt",
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
        ETH_ROPSTEN: {
            displayName: "ETH ROPSTEN",
            name: "ETH",
            value: 60,
            network: "ETH_ROPSTEN",
            icon: icCoinEth
        },
        SOLO: {
            displayName: "SOLO",
            name: "SOLO",
            value: 0,
            network: "SOLO",
            icon: icCoinSolo
        },
    },
    ERROR_TYPE: {
        UNKNOWN: {
            code: "ERR-000",
            title: "System error",
            detail: "",
            type: "Infrastructure"
        },
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
    FLAG_CONFIRM_TIME_OUT: '@confirmTimeout:key',
    BACKUP_FOLDER: `${defaultPath}/SoloSigner`,
};

const DEFAULT_COINS = [
    Constants.COIN_TYPE.BTC,
    Constants.COIN_TYPE.BTC_TEST,
    Constants.COIN_TYPE.ETH,
    Constants.COIN_TYPE.ETH_TEST,
    Constants.COIN_TYPE.ETH_ROPSTEN
];

Constants.DEFAULT_COINS = DEFAULT_COINS;

module.exports = Constants;