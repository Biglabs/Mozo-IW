package com.biglabs.solo.wallet.models.events

class WalletInfoEventMessage {
    var balance: String? = null
    var error: ErrorMessage? = null

    constructor(balance: String) {
        this.balance = balance
    }

    constructor(action: String, errorMessage: String?) {
        this.error = ErrorMessage(action, errorMessage)
    }
}