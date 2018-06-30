package com.biglabs.solo.wallet.utils

import android.support.annotation.IdRes
import com.biglabs.solo.wallet.R

enum class Coin(name: String, @IdRes val icon: Int) {
    BTC("BTC", R.drawable.ic_coin_btc),
    ETH("BTC", R.drawable.ic_coin_eth),
    SOLO("BTC", R.drawable.ic_coin_solo),
    MOZO("BTC", R.drawable.ic_coin_mozo),
}