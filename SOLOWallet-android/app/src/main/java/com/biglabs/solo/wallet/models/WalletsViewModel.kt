package com.biglabs.solo.wallet.models

import android.arch.lifecycle.LiveData
import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import com.biglabs.solo.signer.library.models.Wallet

class WalletsViewModel : ViewModel() {
    private val walletsLiveData = MutableLiveData<List<Wallet>>()
    private val currentWalletLiveData = MutableLiveData<Wallet>()

    fun updateWallets(wallets: List<Wallet>) {
        walletsLiveData.value = wallets
        if (wallets.isNotEmpty()) {
            currentWalletLiveData.value = wallets[0]
        }
    }

    fun updateCurrentWallet(wallet: Wallet) {
        currentWalletLiveData.value = wallet
    }

    fun getWallets(): LiveData<List<Wallet>> {
        return walletsLiveData
    }

    fun getCurrentWallet(): LiveData<Wallet> {
        return currentWalletLiveData
    }
}