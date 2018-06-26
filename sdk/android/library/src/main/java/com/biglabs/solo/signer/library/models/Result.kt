package com.biglabs.solo.signer.library.models

import com.google.gson.annotations.SerializedName

class Result {
    @SerializedName("jsonrpc")
    val jsonRpc: String? = null

    @SerializedName("id")
    val id: Int = 0

    @SerializedName("result")
    val result: String? = null
}