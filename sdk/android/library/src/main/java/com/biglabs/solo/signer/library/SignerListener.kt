package com.biglabs.solo.signer.library

interface SignerListener {
    fun onReceiveBalance(balance: String)

    fun onReceiveSignedTransaction(signedTx: String)

    fun onReceiveSentTransaction(isSuccess: Boolean, txHash: String)
}
