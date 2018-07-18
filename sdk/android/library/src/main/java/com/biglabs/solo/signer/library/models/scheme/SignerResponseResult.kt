package com.biglabs.solo.signer.library.models.scheme

import com.biglabs.solo.signer.library.models.rest.TransactionResponse
import com.google.gson.annotations.SerializedName

internal class SignerResponseResult {

    @SerializedName("walletId")
    var walletId: String? = null

    @SerializedName("signedTransaction")
    var signedTransaction: String? = null

    @SerializedName("error")
    var error: SignerResponseResultError? = null

    fun signedTransactionObject(): TransactionResponse? {
        return if (signedTransaction != null) TransactionResponse.parse(signedTransaction!!) else null
    }
}