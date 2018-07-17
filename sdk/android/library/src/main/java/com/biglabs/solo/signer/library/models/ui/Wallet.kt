package com.biglabs.solo.signer.library.models.ui

import com.biglabs.solo.signer.library.utils.CoinEnum
import com.google.gson.annotations.SerializedName

class Wallet {
    @SerializedName("id")
    var id: Int = 0

    @SerializedName("coin")
    private var coin: String? = null

    @SerializedName("network")
    private var network: String? = null

    @SerializedName("address")
    var address: String? = null

    fun coin(c: CoinEnum? = null): CoinEnum? {
        c?.let {
            this.coin = c.key
        }
        return CoinEnum.find(this.coin, this.network)
    }

    /*
    @SerializedName("balance")
    var balance: String? = null

    @SerializedName("unconfirmedBalance")
    var unconfirmedBalance: String? = null

    @SerializedName("finalBalance")
    var finalBalance: String? = null

    @SerializedName("nConfirmedTx")
    var nConfirmedTx: String? = null

    @SerializedName("nUnconfirmedTx")
    var nUnconfirmedTx: String? = null

    @SerializedName("totalReceived")
    var totalReceived: String? = null

    @SerializedName("totalSent")
    var totalSent: String? = null

    @SerializedName("accountIndex")
    var accountIndex: Int = 0

    @SerializedName("chainIndex")
    var chainIndex: Int = 0

    @SerializedName("addressIndex")
    var addressIndex: Int = 0

    @SerializedName("version")
    var version: Int = 0

    */
}
