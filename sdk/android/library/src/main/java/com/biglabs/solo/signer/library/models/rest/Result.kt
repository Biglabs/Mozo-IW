package com.biglabs.solo.signer.library.models.rest

import com.google.gson.annotations.SerializedName

internal class Result {
    @SerializedName("jsonrpc")
    var jsonRpc: String? = null

    @SerializedName("id")
    var id: Int = 0

    @SerializedName("result")
    var result: String? = null
}