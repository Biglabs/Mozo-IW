package com.biglabs.solo.signer.library.models.ui

import com.biglabs.solo.signer.library.utils.Constants
import com.google.gson.annotations.SerializedName

class TransactionHistory {
    @SerializedName("txHash")
    var txHash: String? = null

    @SerializedName("blockHeight")
    var blockHeight: Int? = null

    @SerializedName("action")
    var action: String? = null

    @SerializedName("fees")
    var fees: Int = 0

    @SerializedName("amount")
    var amount: Double = 0.0

    @SerializedName("time")
    var time: Long = 0L

    @SerializedName("addressTo")
    var addressTo: String? = null

    @SerializedName("confirmations")
    private var confirmations: Int = 0

    @SerializedName("message")
    var message: String? = null

    var isConfirm: Boolean = false
        get() = confirmations >= Constants.MINIMUM_TX_CONFIRMATION
}