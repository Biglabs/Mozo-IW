package com.biglabs.solo.signer.library.utils

import android.support.annotation.IdRes
import com.biglabs.solo.signer.library.R

enum class CoinEnum(val displayName: String, val key: String, val network: String, @IdRes val icon: Int) {
    BTC(
            "BTC",
            "BTC",
            "BTC_MAIN",
            R.drawable.ic_coin_btc
    ),
    BTC_TEST(
            "BTC TESTNET",
            "BTC",
            "BTC_TEST",
            R.drawable.ic_coin_btc
    ),
    ETH(
            "ETH",
            "ETH",
            "ETH_MAIN",
            R.drawable.ic_coin_eth
    ),
    ETH_TEST(
            "ETH TESTNET",
            "ETH",
            "ETH_TEST",
            R.drawable.ic_coin_eth
    ),
    SOLO(
            "SOLO",
            "SOLO",
            "SOLO_MAIN",
            R.drawable.ic_coin_solo
    ),
    MOZO(
            "MOZO",
            "MOZO",
            "ETH_MAIN",
            R.drawable.ic_coin_mozo
    ),
    UNKNOWN(
            "UNKNOWN",
            "UNKNOWN",
            "UNKNOWN",
            R.drawable.ic_coin_unknown
    );

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