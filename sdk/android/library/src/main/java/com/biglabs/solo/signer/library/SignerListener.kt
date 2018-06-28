package com.biglabs.solo.signer.library

import com.biglabs.solo.signer.library.models.Wallet

interface SignerListener {

    fun onReceiveHandshake(walletID: String)

    fun onReceiveWallets(wallets: List<Wallet>?)

    fun onReceiveBalance(balance: String)

    fun onReceiveSignedTransaction(signedTx: String)

    fun onReceiveSentTransaction(isSuccess: Boolean, txHash: String)
}
