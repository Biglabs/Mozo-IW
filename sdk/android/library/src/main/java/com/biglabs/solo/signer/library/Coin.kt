package com.biglabs.solo.signer.library

import android.support.annotation.IdRes

enum class Coin(val key: String, @IdRes val icon: Int) {
    BTC("BTC", R.drawable.ic_coin_btc),
    ETH("ETH", R.drawable.ic_coin_eth),
    SOLO("SOLO", R.drawable.ic_coin_solo),
    MOZO("MOZO", R.drawable.ic_coin_mozo);

    companion object {
        private val map = Coin.values().associateBy(Coin::key)
        fun fromKey(key: String) = map[key]
    }
}