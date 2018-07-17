package com.biglabs.solo.signer.library.models.scheme

import com.google.gson.annotations.SerializedName

internal class SignerResponseResultError {

    @SerializedName("code")
    var code: String? = null

    @SerializedName("title")
    var title: String? = null

    @SerializedName("detail")
    var detail: String? = null

    @SerializedName("type")
    var type: String? = null

}