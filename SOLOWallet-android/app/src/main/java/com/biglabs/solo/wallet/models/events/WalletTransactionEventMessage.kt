package com.biglabs.solo.wallet.models.events

class WalletTransactionEventMessage(val isSigned: Boolean = false, val isSent: Boolean = false, val txHash: String? = null)