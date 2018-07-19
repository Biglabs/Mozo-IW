package com.biglabs.solo.signer.library.models.rest

import com.google.gson.annotations.SerializedName

internal class BalanceResponse {
    @SerializedName("address")
    var address: String? = null

    @SerializedName("balance")
    var balance: Double = 0.0

    @SerializedName("final_balance")
    var finalBalance: Double = 0.0
}