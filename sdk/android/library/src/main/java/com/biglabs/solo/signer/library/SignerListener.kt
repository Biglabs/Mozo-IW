package com.biglabs.solo.signer.library

import com.biglabs.solo.signer.library.models.Wallet

interface SignerListener {

    fun onSyncCompleted()

    fun onReceiveWallets(wallets: List<Wallet>?)

    fun onReceiveBalance(balance: String)

    fun onReceiveSignedTransaction(rawTx: String)

    fun onReceiveSentTransaction(isSuccess: Boolean, txHash: String)
}
