package com.biglabs.solo.signer.library.models.new

import com.google.gson.annotations.SerializedName

class CommunicationDTO {
    @SerializedName("action")
    var action: String? = null

    @SerializedName("receiver")
    var receiver: String? = null

    @SerializedName("params")
    var params: IntermediaryTransactionDTO? = null

    @SerializedName("coinType")
    var coinType: String? = null

    @SerializedName("result")
    var result: ResultDTO? = null

    @SerializedName("network")
    var network: String? = null
}