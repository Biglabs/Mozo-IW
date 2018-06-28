package com.biglabs.solo.signer.library.models

import com.google.gson.Gson

class GetBalanceRequest(address: String) {
    private val jsonrpc = "2.0"
    private val id: Int = 1
    private val method: String = "eth_getBalance"
    private val params: Array<String> = arrayOf(address, "latest")

    override fun toString(): String {
        return Gson().toJson(this)
    }
}
