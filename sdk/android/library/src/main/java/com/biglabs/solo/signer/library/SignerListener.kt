package com.biglabs.solo.signer.library

import com.biglabs.solo.signer.library.models.ui.TransactionHistory
import com.biglabs.solo.signer.library.models.ui.Wallet

interface SignerListener {

    fun onSyncCompleted()

    fun onReceiveWallets(wallets: List<Wallet>)

    fun onReceiveBalance(balance: String)

    fun onReceiveTransactionHistory(histories: List<TransactionHistory>)

    fun onReceiveSignTransactionResult(isSuccess: Boolean)

    fun onReceiveSentTransaction(isSuccess: Boolean, txHash: String?)

    fun onError(action: String, message: String?)
}
