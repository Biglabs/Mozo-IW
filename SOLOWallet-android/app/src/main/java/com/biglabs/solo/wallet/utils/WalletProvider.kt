package com.biglabs.solo.wallet.utils

import com.biglabs.solo.signer.library.utils.CoinEnum
import com.biglabs.solo.signer.library.models.ui.Wallet

class WalletProvider{
    companion object {
        fun getWallet(): ArrayList<Wallet> {

            val walletList = arrayListOf<Wallet>()
            val wallet = Wallet()
            wallet.address = "0x011df24265841dCdbf2e60984BB94007b0C1d76A"
            wallet.coin(CoinEnum.ETH_TEST)
            walletList.add(wallet)

            val wallet2 = Wallet()
            wallet2.address = "16pP4kGDPF2yFfLFWpyEwdaMpMd6afszMe"
            wallet2.coin(CoinEnum.BTC)
            walletList.add(wallet2)

            val w3 = Wallet()
            w3.address = "1PgGqs7bYXcf8zhxFGNAyEvcvPVa1M6yna"
            w3.coin(CoinEnum.BTC)
            walletList.add(w3)

            return walletList
        }
    }
}