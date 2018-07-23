package com.biglabs.solo.signer.library.models.ui

import com.biglabs.solo.signer.library.utils.CoinEnum
import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.math.BigDecimal

class Wallet {
    @SerializedName("id")
    var id: Int = 0

    @SerializedName("coin")
    private var coinType: String? = null

    @SerializedName("network")
    private var network: String? = null

    @SerializedName("address")
    var address: String? = null

    @Transient
    var coin = CoinEnum.UNKNOWN
        get() = CoinEnum.find(this.coinType, this.network)

    var balance: BigDecimal? = null

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
