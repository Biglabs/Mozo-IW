package com.biglabs.solo.signer.library

abstract class SignerListener {
    fun onReceivedBalance(balance: String) {

    }

    fun onTransactionSent(isSuccess: Boolean, txHash: String) {

    }
}
