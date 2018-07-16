package com.biglabs.solo.signer.library.models.new

import com.google.gson.annotations.SerializedName

class ResultDTO {
    @SerializedName("error")
    var error: ErrorDTO? = null

    @SerializedName("walletId")
    var walletId: String? = null

    @SerializedName("signedTransaction")
    var signedTransaction: String? = null
}