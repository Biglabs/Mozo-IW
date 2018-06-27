package com.biglabs.solo.signer.library.models

import com.google.gson.annotations.SerializedName

class SignerResponse {
    @SerializedName("action")
    var action: String? = null

    @SerializedName("result")
    var result: SchemeResult? = null
}