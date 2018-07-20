package com.biglabs.solo.wallet.models.events

class WalletInfoEventMessage {
    var balance: String? = null

    constructor(balance: String) {
        this.balance = balance
    }
}