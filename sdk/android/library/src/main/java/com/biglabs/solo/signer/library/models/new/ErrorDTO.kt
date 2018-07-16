package com.biglabs.solo.signer.library.models.new

import com.google.gson.annotations.SerializedName

class ErrorDTO {
    @SerializedName("code")
    var code: String? = null

    @SerializedName("title")
    var title: String? = null

    @SerializedName("detail")
    var detail: String? = null

    @SerializedName("type")
    var type: String? = null
}