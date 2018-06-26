package com.biglabs.solo.signer.library.models

import com.google.gson.annotations.SerializedName

class Wallet {
    @SerializedName("id")
    val id: String? = null

    @SerializedName("walletKey")
    val key: String? = null

    @SerializedName("walletId")
    val address: String? = null
}
