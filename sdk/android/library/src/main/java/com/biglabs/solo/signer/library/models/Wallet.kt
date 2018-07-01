package com.biglabs.solo.signer.library.models

import com.biglabs.solo.signer.library.Coin
import com.google.gson.annotations.SerializedName

class Wallet {
    @SerializedName("id")
    var id: String? = null

    @SerializedName("coin")
    var coinKey: String? = null
    // TODO make coinKey internal

    @SerializedName("network")
    var network: String? = null

    @SerializedName("address")
    var address: String? = null

    fun coin(): Coin? {
        return if (coinKey != null) Coin.fromKey(coinKey!!)!! else null
    }
}
