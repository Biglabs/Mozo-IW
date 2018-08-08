import {icCoinBtc, icCoinEth, icCoinMozo, icCoinSolo} from '../res/icons';
import { strings } from '../helpers/i18nUtils';

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
            title: strings('error.system.title'),
            detail: "",
            type: "Infrastructure"
        },
        NONE: {},
        NO_WALLET_INFO: {
            code: "ERR-001",
            title: strings('error.no_wallet.title'),
            detail: strings('error.no_wallet.detail'),
            type: "Infrastructure & Business"
        },
        CANCEL_REQUEST: {
            code: "ERR-002",
            title: strings('error.cancel_request.title'),
            detail: strings('error.cancel_request.detail'),
            type: "Business"
        },
        TIME_OUT_CONFIRM: {
            code: "ERR-003",
            title: strings('error.timeout_confirm.title'),
            detail: strings('error.timeout_confirm.detail'),
            type: "Business"
        },
        INVALID_ADDRESS: {
            code: "ERR-004",
            title: strings('error.invalid_address.title'),
            detail: strings('error.invalid_address.detail'),
            type: "Business"
        },
        WRONG_PASSWORD: {
            code: "ERR-005",
            title: strings('error.wrong_password.title'),
            detail: strings('error.wrong_password.detail'),
            type: "Business"
        },
        INCORRECT_CONFIRM_PASSWORD: {
            code: "ERR-006",
            title: strings('error.incorrect_confirm_password.title'),
            detail: strings('error.incorrect_confirm_password.detail'),
            type: "Business"
        },
        INVALID_BACKUP_PHRASE: {
            code: "ERR-007",
            title: strings('error.invalid_backup_phrase.title'),
            detail: strings('error.invalid_backup_phrase.detail'),
            type: "Business"
        },
        CANNOT_VIEW_BACKUP_PHRASE: {
            code: "ERR-008",
            title: strings('error.system.title'),
            detail: strings('error.cannot_view_backup_phrase.detail'),
            type: "Business"
        },
        CANNOT_BACKUP_WALLET: {
            code: "ERR-009",
            title: strings('error.system.title'),
            detail: strings('error.cannot_backup_wallet.detail'),
            type: "Business"
        }
    },
    FLAG_DB_EXISTING: '@DbExisting:key',
    FLAG_PUBLIC_KEY: '@publicKey:key',
    FLAG_SCHEME_DATA: '@schemeData:key',
    FLAG_ADDRESS_SYNC: '@addressSync:key',
    FLAG_BACKUP_WALLET: '@backupWallet:key',
    FLAG_CONFIRM_TIME_OUT: '@confirmTimeout:key',
};

const DEFAULT_COINS = [
    Constants.COIN_TYPE.ETH,
    Constants.COIN_TYPE.ETH_TEST,
    Constants.COIN_TYPE.ETH_ROPSTEN
].map(c => {
    c.isDefault = true;
    return c;
});

Constants.DEFAULT_COINS = DEFAULT_COINS;

module.exports = Constants;
