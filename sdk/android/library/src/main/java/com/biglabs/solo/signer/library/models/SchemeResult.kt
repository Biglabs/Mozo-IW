package com.biglabs.solo.signer.library.models

import com.google.gson.annotations.SerializedName

class SchemeResult {

    @SerializedName("signedTransaction")
    var transactionData: String? = null

}