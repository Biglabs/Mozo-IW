package com.biglabs.solo.wallet.models

import com.biglabs.solo.signer.library.Coin

class CoinCheckable(val coin: Coin, var walletIndex: Int = -1) : Comparable<CoinCheckable> {
    var checked = false

    override fun compareTo(other: CoinCheckable): Int {
        return coin.key.compareTo(other.coin.key)
    }

    override fun equals(other: Any?): Boolean {
        return other is CoinCheckable && coin == other.coin
    }

    override fun hashCode(): Int {
        return coin.hashCode()
    }
}