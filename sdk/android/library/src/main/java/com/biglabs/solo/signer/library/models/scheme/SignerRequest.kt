package com.biglabs.solo.signer.library.models.scheme

import com.google.gson.Gson
import com.google.gson.annotations.SerializedName

internal class SignerRequest(
        @SerializedName("action") var action: String,
        @SerializedName("receiver") var receiver: String,
        @SerializedName("coinType") var coinType: String? = null,
        @SerializedName("network") var network: String? = null,
        @SerializedName("params") var params: Any? = null) {

    override fun toString(): String {
        return Gson().toJson(this)
    }
}