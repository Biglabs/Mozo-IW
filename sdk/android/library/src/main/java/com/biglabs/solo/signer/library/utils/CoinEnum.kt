package com.biglabs.solo.signer.library.utils

import android.support.annotation.IdRes
import com.biglabs.solo.signer.library.R

enum class CoinEnum(val displayName: String, val fullName: String, val key: String, val network: String, @IdRes val icon: Int) {
    BTC(
            "BTC",
            "bitcoin",
            "BTC",
            "BTC_MAIN",
            R.drawable.ic_coin_btc
    ),
    BTC_TEST(
            "BTC TESTNET",
            "bitcoin",
            "BTC",
            "BTC_TEST",
            R.drawable.ic_coin_btc
    ),
    ETH(
            "ETH",
            "ethereum",
            "ETH",
            "ETH_MAIN",
            R.drawable.ic_coin_eth
    ),
    ETH_TEST(
            "ETH TESTNET",
            "ethereum",
            "ETH",
            "ETH_TEST",
            R.drawable.ic_coin_eth
    ),
    ETH_ROPSTEN(
            "ETH ROPSTEN",
            "ethereum",
            "ETH",
            "ETH_ROPSTEN",
            R.drawable.ic_coin_eth
    ),
    SOLO(
            "SOLO",
            "solo",
            "SOLO",
            "SOLO_MAIN",
            R.drawable.ic_coin_solo
    ),
    MOZO(
            "MOZO",
            "mozo",
            "MOZO",
            "ETH_MAIN",
            R.drawable.ic_coin_mozo
    ),
    UNKNOWN(
            "UNKNOWN",
            "unknown",
            "UNKNOWN",
            "UNKNOWN",
            R.drawable.ic_coin_unknown
    );

    internal fun getNetworkForAPI(): String {
        return when {
            network.contains("main", true) -> "main"
            network.contains("test", true) -> "test"
            network.contains("ropsten", true) -> "ropsten"
            else -> network
        }
    }

    companion object {
        internal fun find(key: String?, network: String?): CoinEnum {
            return try {
                values().single { c ->
                    c.key.equals(key, true) && c.network.equals(network, true)
                }
            } catch (_: Exception) {
                UNKNOWN
            }
        }
    }
}