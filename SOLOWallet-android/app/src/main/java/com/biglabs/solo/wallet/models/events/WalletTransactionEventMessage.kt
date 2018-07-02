package com.biglabs.solo.wallet.models.events

class WalletTransactionEventMessage {

    var rawTx: String? = null
    var isSuccess: Boolean? = null
    var txHash: String? = null

    constructor(rawTx: String) {
        this.rawTx = rawTx
    }

    constructor(isSuccess: Boolean, txHash: String) {
        this.isSuccess = isSuccess
        this.txHash = txHash
    }
}