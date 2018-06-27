package com.biglabs.solo.signer.library.models

import com.google.gson.Gson

class Transaction(transactionData: String) {
    private val id: Int = 0
    private val method: String = "eth_sendRawTransaction"
    private val params: Array<String> = arrayOf(transactionData)

    override fun toString(): String {
        return Gson().toJson(this)
    }
}
