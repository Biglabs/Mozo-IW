package com.biglabs.solo.signer.library.models

import com.google.gson.annotations.SerializedName

class Wallet {
    @SerializedName("id")
    var id: String? = null

    @SerializedName("coin")
    var coin: String? = null

    @SerializedName("network")
    var network: String? = null

    @SerializedName("address")
    var address: String? = null
}
