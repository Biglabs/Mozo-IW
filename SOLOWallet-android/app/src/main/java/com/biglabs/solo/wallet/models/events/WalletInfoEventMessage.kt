package com.biglabs.solo.wallet.models.events

import java.math.BigDecimal

class WalletInfoEventMessage {
    var balance: BigDecimal? = null

    constructor(balance: BigDecimal) {
        this.balance = balance
    }
}