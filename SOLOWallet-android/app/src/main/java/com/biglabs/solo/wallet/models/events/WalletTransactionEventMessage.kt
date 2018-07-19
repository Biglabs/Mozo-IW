package com.biglabs.solo.wallet.models.events

class WalletTransactionEventMessage {

    var isSigned: Boolean = false
    var isSent: Boolean = false
    var txHash: String? = null

    var error: ErrorMessage? = null

    constructor(isSigned: Boolean = false, isSent: Boolean = false, txHash: String? = null) {
        this.isSigned = isSigned
        this.isSent = isSent
        this.txHash = txHash
    }

    constructor(action: String, errorMessage: String?) {
        this.error = ErrorMessage(action, errorMessage)
    }
}