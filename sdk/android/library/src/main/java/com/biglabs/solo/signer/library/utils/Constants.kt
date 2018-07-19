package com.biglabs.solo.signer.library.utils

class Constants {
    companion object {
        internal const val API_BASE_URL = "http://192.168.1.98:9060/api/"

        internal const val SIGNER_SCHEME = "solosigner"
        internal const val WALLET_SCHEME_SUFFIX = "solowallet"

        const val GAS_LIMIT_EXTERNAL_ACCOUNT = 21000L
        const val GAS_LIMIT_CONTRACT_ACCOUNT = 80000L
    }
}