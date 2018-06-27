package com.biglabs.solo.signer.library.models

import com.google.gson.annotations.SerializedName

class Wallet {
    @SerializedName("id")
    var id: String? = null

    @SerializedName("walletKey")
    var key: String? = null

    @SerializedName("walletId")
    var address: String? = null
}
