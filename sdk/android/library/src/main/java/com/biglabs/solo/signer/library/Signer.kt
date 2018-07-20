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
import com.biglabs.solo.signer.library.utils.CoinUtils
import com.biglabs.solo.signer.library.utils.Constants
import com.biglabs.solo.signer.library.utils.SchemeUtils
import com.biglabs.solo.signer.library.utils.logAsError
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
                        (context as? Activity)?.finish()
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
                    this@Signer.mSignerListener?.onReceiveWallets(response.body() ?: listOf())
                }

                override fun onFailure(call: Call<List<Wallet>>?, t: Throwable?) {
                    this@Signer.mSignerListener?.onError(ACTION_GET_WALLETS, t?.message)
                }
            })
        } else {
            handShakeWithSignerApp(context)
        }
    }

    fun getBalance(wallet: Wallet) {

        val coinType = wallet.coin().key

        wallet.address?.logAsError("getBalance: $coinType")
        this.mSoloService.getBalance(coinType.toLowerCase(), wallet.address!!).enqueue(object : Callback<BalanceResponse> {
            override fun onResponse(call: Call<BalanceResponse>?, response: Response<BalanceResponse>?) {
                if (response?.body() != null) {
                    val balance = (CoinUtils.convertToUIUnit(coinType, response.body()!!.finalBalance))
                    this@Signer.mSignerListener?.onReceiveBalance(balance.toString())
                } else {
                    this@Signer.mSignerListener?.onError(ACTION_GET_BALANCE, response?.message())
                }
            }

            override fun onFailure(call: Call<BalanceResponse>?, t: Throwable?) {
                this@Signer.mSignerListener?.onError(ACTION_UNKNOWN, t?.message)
            }
        })
    }

    fun getTransactionHistory(wallet: Wallet) {
        this.mSoloService.getTxHistory(wallet.coin().key.toLowerCase(), wallet.address!!).enqueue(object : Callback<List<TransactionHistory>> {
            override fun onResponse(call: Call<List<TransactionHistory>>?, response: Response<List<TransactionHistory>>?) {
                if(response?.body() !=null){
                    this@Signer.mSignerListener?.onReceiveTransactionHistory(response.body()!!)
                }else{
                    this@Signer.mSignerListener?.onError(ACTION_GET_TX_HISTORY, response?.message())
                }
            }

            override fun onFailure(call: Call<List<TransactionHistory>>?, t: Throwable?) {
                this@Signer.mSignerListener?.onError(ACTION_UNKNOWN, t?.message)
            }
        })
    }

    fun createTransaction(context: Context, fromAddress: String, toAddress: String, gasLimit: String, coinType: String, network: String, value: String, msg: String) {
        clearTempData()

        val v: Double = value.toDoubleOrNull() ?: 0.0
        val valueInLong: Long = CoinUtils.convertToServerUnit(coinType, v).toLong()

        val params = TransactionResponseContent(fromAddress, toAddress, valueInLong)
        params.gasLimit = gasLimit.toLongOrNull() ?: Constants.GAS_LIMIT_EXTERNAL_ACCOUNT
        params.toString().logAsError("createTx param\n")

        this.mSoloService.createTx(coinType.toLowerCase(), params).enqueue(object : Callback<TransactionResponse> {
            override fun onResponse(call: Call<TransactionResponse>?, response: Response<TransactionResponse>?) {
                response?.body()?.toString()?.logAsError("createTx response\n")

                this@Signer.mLastTxCoinType = coinType
                this@Signer.mLastTxMsg = msg
                openDeepLink(context, Constants.SCHEME_ACTION_SIGN_TX, coinType, network, response?.body())
            }

            override fun onFailure(call: Call<TransactionResponse>?, t: Throwable?) {
                this@Signer.mSignerListener?.onError(ACTION_CONFIRM_TX, t?.message)
            }
        })
    }

    fun sendTransaction() {
        this.mLastTxSignedData?.let {
            it.toString().logAsError("mLastTxSignedData\n")
            this.mSoloService.sendTx(this.mLastTxCoinType?.toLowerCase()!!, it).enqueue(object : Callback<TransactionResponse> {
                override fun onResponse(call: Call<TransactionResponse>?, response: Response<TransactionResponse>?) {
                    this@Signer.mSignerListener?.onReceiveSentTransaction(response?.isSuccessful == true, response?.body()?.tx?.hash)
                    clearTempData()
                }

                override fun onFailure(call: Call<TransactionResponse>?, t: Throwable?) {
                    this@Signer.mSignerListener?.onError(ACTION_SEND_TX, t?.message)
                }
            })
        }
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
