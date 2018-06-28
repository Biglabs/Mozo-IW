package com.biglabs.solo.signer.library.models

import com.google.gson.annotations.SerializedName

class SchemeResult {

    @SerializedName("walletId")
    var walletId: String? = null

    @SerializedName("signedTransaction")
    var transactionData: String? = null

}