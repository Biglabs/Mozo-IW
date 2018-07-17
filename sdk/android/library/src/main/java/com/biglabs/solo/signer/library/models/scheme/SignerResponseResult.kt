package com.biglabs.solo.signer.library.models.scheme

import com.google.gson.annotations.SerializedName

internal class SignerResponseResult {

    @SerializedName("walletId")
    var walletId: String? = null

    @SerializedName("signedTransaction")
    var transactionData: String? = null

    @SerializedName("error")
    var error: SignerResponseResultError? = null
}