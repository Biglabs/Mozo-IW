package com.biglabs.solo.signer.library.utils

class Constants {
    companion object {
        internal const val API_BASE_URL = "http://192.168.1.98:9000/api/"

        internal const val SCHEME_SIGNER_APP = "solosigner"
        internal const val SCHEME_WALLET_SUFFIX = "solowallet"

        internal const val SCHEME_ACTION_GET_WALLET = "GET_WALLET"
        internal const val SCHEME_ACTION_MANAGE_WALLET = "MANAGE_WALLET"
        internal const val SCHEME_ACTION_SIGN_TX = "SIGN"

        const val GAS_LIMIT_EXTERNAL_ACCOUNT = 21000L
        const val GAS_LIMIT_CONTRACT_ACCOUNT = 80000L

        const val MINIMUM_TX_CONFIRMATION = 6

        const val API_ITEM_PER_PAGE = 20
    }
}