package com.biglabs.solo.signer.library

import android.app.Activity
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.text.TextUtils
import android.widget.Toast
import com.biglabs.solo.signer.library.models.rest.BalanceResponse
import com.biglabs.solo.signer.library.models.rest.TransactionResponse
import com.biglabs.solo.signer.library.models.rest.TransactionResponseContent
import com.biglabs.solo.signer.library.models.scheme.SignerRequest
import com.biglabs.solo.signer.library.models.scheme.SignerResponse
import com.biglabs.solo.signer.library.models.ui.TransactionHistory
import com.biglabs.solo.signer.library.models.ui.Wallet
import com.biglabs.solo.signer.library.utils.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

@Suppress("unused")
class Signer private constructor(private val walletScheme: String) {

    private val mSoloService: SoloService = SoloService.create()
    private var mSignerListener: SignerListener? = null
    private var mPreferences: SharedPreferences? = null

    private var myWalletID: String? = null
    private var mLastTxSignedData: TransactionResponse? = null
    private var mLastTxCoinType: String? = null
    private var mLastTxMsg: String? = null

    private fun openDeepLink(context: Context, action: String, coinType: String? = null, network: String? = null, params: Any? = null) {
        val signerLink = SchemeUtils.prepareSignerLink(
                SignerRequest(
                        action,
                        walletScheme,
                        coinType,
                        network,
                        params
                )
        )
        signerLink.toString().logAsError("openDeepLink")
        val isOpenSuccess = SchemeUtils.openLink(context, signerLink)
        if (!isOpenSuccess) {
            Toast.makeText(context, "Could not found SOLO Signer app!", Toast.LENGTH_LONG).show()
        }
    }

    private fun handShakeWithSignerApp(context: Context) {
        this.myWalletID = mPreferences!!.getString(KEY_WALLET_ID, null)
        if (this.myWalletID == null) {
            AlertDialog.Builder(context)
                    .setCancelable(false)
                    .setTitle("Notice!")
                    .setMessage("At the first launch, we need to initialize data from Signer application")
                    .setPositiveButton("Open Signer App") { dialog, _ ->
                        dialog.dismiss()
                        openDeepLink(context, Constants.SCHEME_ACTION_GET_WALLET)
                    }
                    .setNegativeButton(android.R.string.cancel) { dialog, _ ->
                        dialog.dismiss()
                        instance = null
                        (context as Activity).finish()
                    }
                    .create()
                    .show()
        } else {
            this.mSignerListener?.onSyncCompleted()
        }
    }

    fun getWallets(context: Context) {
        myWalletID?.logAsError("walletID")
        if (myWalletID != null) {
            this.mSoloService.getWalletAddress(myWalletID!!).enqueue(object : Callback<List<Wallet>> {
                override fun onResponse(call: Call<List<Wallet>>, response: Response<List<Wallet>>) {
                    this@Signer.mSignerListener?.onReceiveWallets(
                            (response.body() ?: listOf()).filter { it.coin != CoinEnum.UNKNOWN }
                    )
                }

                override fun onFailure(call: Call<List<Wallet>>?, t: Throwable?) {
                    call?.request()?.url()?.toString()?.logAsError("API Failed")
                    this@Signer.mSignerListener?.onError(ACTION_GET_WALLETS, t?.message)
                }
            })
        } else {
            handShakeWithSignerApp(context)
        }
    }

    fun getBalance(wallet: Wallet) {
        val coinType = wallet.coin.key
        val network = wallet.coin.getNetworkForAPI()

        wallet.address?.logAsError("getBalance: $coinType")
        this.mSoloService.getBalance(coinType.toLowerCase(), network, wallet.address!!).enqueue(object : Callback<BalanceResponse> {
            override fun onResponse(call: Call<BalanceResponse>?, response: Response<BalanceResponse>?) {
                if (response?.body() != null) {
                    val balance = CoinUtils.convertToUIUnit(coinType, response.body()!!.balance)
                    this@Signer.mSignerListener?.onReceiveBalance(balance)
                } else {
                    call?.request()?.url()?.toString()?.logAsError("API Failed")
                    this@Signer.mSignerListener?.onError(ACTION_GET_BALANCE, response?.message())
                }
            }

            override fun onFailure(call: Call<BalanceResponse>?, t: Throwable?) {
                call?.request()?.url()?.toString()?.logAsError("API Failed")
                this@Signer.mSignerListener?.onError(ACTION_UNKNOWN, t?.message)
            }
        })
    }

    fun getTransactionHistory(wallet: Wallet, lastItemBlockHeight: Int = 0) {
        val callback = object : Callback<List<TransactionHistory>> {
            override fun onResponse(call: Call<List<TransactionHistory>>?, response: Response<List<TransactionHistory>>?) {
                if (response?.body() != null) {
                    this@Signer.mSignerListener?.onReceiveTransactionHistory(response.body()!!)
                } else {
                    call?.request()?.url()?.toString()?.logAsError("API Failed")
                    this@Signer.mSignerListener?.onError(ACTION_GET_TX_HISTORY, response?.message())
                }
            }

            override fun onFailure(call: Call<List<TransactionHistory>>?, t: Throwable?) {
                call?.request()?.url()?.toString()?.logAsError("API Failed")
                this@Signer.mSignerListener?.onError(ACTION_UNKNOWN, t?.message)
            }
        }
        if (lastItemBlockHeight > 0) {
            this.mSoloService.getTxHistory(wallet.coin.key.toLowerCase(), wallet.coin.getNetworkForAPI(), wallet.address!!, lastItemBlockHeight).enqueue(callback)
        } else {
            this.mSoloService.getTxHistory(wallet.coin.key.toLowerCase(), wallet.coin.getNetworkForAPI(), wallet.address!!).enqueue(callback)
        }
    }

    fun createTransaction(context: Context, fromAddress: String, toAddress: String, gasLimit: String, coin: CoinEnum, value: String, msg: String) {
        clearTempData()

        val v: Double = value.toDoubleOrNull() ?: 0.0
        val valueInLong: Long = CoinUtils.convertToServerUnit(coin.key, v).toLong()

        val params = TransactionResponseContent(fromAddress, toAddress, valueInLong)
        params.gasLimit = gasLimit.toLongOrNull() ?: Constants.GAS_LIMIT_EXTERNAL_ACCOUNT
        params.toString().logAsError("createTx param\n")

        this.mSoloService.createTx(coin.key.toLowerCase(), coin.getNetworkForAPI(), params).enqueue(object : Callback<TransactionResponse> {
            override fun onResponse(call: Call<TransactionResponse>?, response: Response<TransactionResponse>?) {
                response?.body()?.toString()?.logAsError("createTx response\n")

                this@Signer.mLastTxCoinType = coin.key
                this@Signer.mLastTxMsg = msg
                openDeepLink(context, Constants.SCHEME_ACTION_SIGN_TX, coin.key, coin.network, response?.body())
            }

            override fun onFailure(call: Call<TransactionResponse>?, t: Throwable?) {
                call?.request()?.url()?.toString()?.logAsError("API Failed")
                this@Signer.mSignerListener?.onError(ACTION_CONFIRM_TX, t?.message)
            }
        })
    }

    fun sendTransaction(coin: CoinEnum) {
        this.mLastTxSignedData?.let {
            it.toString().logAsError("mLastTxSignedData\n")
            this.mSoloService.sendTx(this.mLastTxCoinType?.toLowerCase()!!, coin.getNetworkForAPI(), it).enqueue(object : Callback<TransactionResponse> {
                override fun onResponse(call: Call<TransactionResponse>?, response: Response<TransactionResponse>?) {
                    this@Signer.mSignerListener?.onReceiveSentTransaction(response?.isSuccessful == true, response?.body()?.tx?.hash)
                    clearTempData()
                }

                override fun onFailure(call: Call<TransactionResponse>?, t: Throwable?) {
                    call?.request()?.url()?.toString()?.logAsError("API Failed")
                    this@Signer.mSignerListener?.onError(ACTION_SEND_TX, t?.message)
                }
            })
        }
    }

    fun manageWallet(context: Context) {
        openDeepLink(context, Constants.SCHEME_ACTION_MANAGE_WALLET)
    }

    fun handleScheme(intent: Intent) {
        if (TextUtils.equals(intent.scheme, walletScheme)) {
            val data = intent.dataString.split("://")[1]
            val response = SignerResponse.parse(data)
            response?.let {
                when (it.action) {
                    Constants.SCHEME_ACTION_GET_WALLET -> {
                        this.myWalletID = it.result?.walletId!!
                        mPreferences?.edit()?.putString(KEY_WALLET_ID, this.myWalletID)?.apply()
                        this.mSignerListener?.onSyncCompleted()
                    }
                    Constants.SCHEME_ACTION_SIGN_TX -> {
                        this.mLastTxSignedData = it.result?.signedTransactionObject()
                        this.mSignerListener?.onReceiveSignTransactionResult(this.mLastTxSignedData != null)
                    }
                    Constants.SCHEME_ACTION_MANAGE_WALLET -> {
                        this.mSignerListener?.onSyncCompleted()
                    }
                    else -> {
                    }
                }
            }
        }
    }

    private fun clearTempData() {
        this@Signer.mLastTxSignedData = null
        this@Signer.mLastTxCoinType = null
        this@Signer.mLastTxMsg = null
    }

    companion object {
        const val ACTION_UNKNOWN = "ACTION_UNKNOWN"
        const val ACTION_GET_WALLETS = "ACTION_GET_WALLETS"
        const val ACTION_GET_BALANCE = "ACTION_GET_BALANCE"
        const val ACTION_GET_TX_HISTORY = "ACTION_GET_TX_HISTORY"
        const val ACTION_CONFIRM_TX = "ACTION_CONFIRM_TX"
        const val ACTION_SEND_TX = "ACTION_SEND_TX"

        private const val KEY_WALLET_ID = "KEY_WALLET_ID"

        @Volatile
        private var instance: Signer? = null

        fun initialize(context: Context, listener: SignerListener, applicationId: String) {
            if (instance == null) {
                synchronized(this) {
                    if (instance == null) {
                        val walletScheme = SchemeUtils.prepareWalletReceiveScheme(applicationId)
                        instance = Signer(walletScheme)
                        instance!!.mSignerListener = listener
                        instance!!.mPreferences = context.getSharedPreferences(walletScheme, Context.MODE_PRIVATE)
                        instance!!.handShakeWithSignerApp(context)
                    }
                }
            } else {
                instance!!.mSignerListener = null
                instance!!.mSignerListener = listener
                instance!!.handShakeWithSignerApp(context)
            }
        }

        @Synchronized
        fun getInstance(): Signer {
            if (instance == null) {
                throw RuntimeException("Must call Signer.initialize(Context, String) first!")
            }
            return instance as Signer
        }
    }
}
