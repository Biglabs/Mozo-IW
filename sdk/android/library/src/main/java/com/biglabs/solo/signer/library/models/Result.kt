package com.biglabs.solo.signer.library.models

import com.google.gson.annotations.SerializedName

class Result {
    @SerializedName("jsonrpc")
    var jsonRpc: String? = null

    @SerializedName("id")
    var id: Int = 0

    @SerializedName("result")
    var result: String? = null
}