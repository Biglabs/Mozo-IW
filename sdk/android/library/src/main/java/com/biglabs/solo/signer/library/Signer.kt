package com.biglabs.solo.signer.library

import android.app.Activity
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.text.TextUtils
import android.widget.Toast
import com.biglabs.solo.signer.library.models.rest.GetBalanceRequest
import com.biglabs.solo.signer.library.models.rest.TransactionResponse
import com.biglabs.solo.signer.library.models.rest.TransactionResponseContent
import com.biglabs.solo.signer.library.models.scheme.SignerRequest
import com.biglabs.solo.signer.library.models.scheme.SignerResponse
import com.biglabs.solo.signer.library.models.ui.Wallet
import com.biglabs.solo.signer.library.utils.CoinEnum
import com.biglabs.solo.signer.library.utils.SchemeUtils
import com.biglabs.solo.signer.library.utils.logAsError
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

@Suppress("unused")
class Signer private constructor(private val walletScheme: String) {

    private val mSoloService: SoloService = SoloService.create()
    private var mSignerListener: SignerListener? = null
    private var mPreferences: SharedPreferences? = null
    private var myWalletID: String? = null

    private fun openDeepLink(context: Context, action: String, coinType: String? = null, network: String? = null, params: JSONObject? = null) {
        val signerLink = SchemeUtils.prepareSignerLink(
                SignerRequest(
                        action,
                        walletScheme,
                        coinType,
                        network,
                        params.toString()
                )
        )
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
                        openDeepLink(context, ACTION_GET_WALLET)
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
                    this@Signer.mSignerListener?.onReceiveWallets(response.body())
                }

                override fun onFailure(call: Call<List<Wallet>>?, t: Throwable?) {
                    this@Signer.mSignerListener?.onReceiveWallets(null)
                }
            })
        } else {
            handShakeWithSignerApp(context)
        }
    }

    fun getBalance(address: String) {
        val params = GetBalanceRequest(address)
//        this.mRopstenService.getBalance(params).enqueue(object : Callback<Result> {
//            override fun onResponse(call: Call<Result>, response: Response<Result>) {
//                if (this@Signer.mSignerListener != null && response.body() != null) {
//                    val result = if (response.body()!!.result != null) response.body()!!.result else "0"
//                    val bigInteger = BigDecimal(BigInteger(result!!.replace("0x", ""), 16))
//                    val balanceInEther = bigInteger.divide(BigDecimal("1000000000000000000"))
//                    this@Signer.mSignerListener!!.onReceiveBalance(balanceInEther.toString())
//                }
//            }
//
//            override fun onFailure(call: Call<Result>, t: Throwable) {
//                this@Signer.mSignerListener!!.onReceiveBalance(t.message!!)
//            }
//        })
    }

    fun confirmTransaction(context: Context, fromAddress: String, toAddress: String, coinType: String, network: String, value: String, msg: String) {

        val v: Double = value.toDoubleOrNull() ?: 0.0

        val valueInLong: Long = (when (coinType) {
            CoinEnum.BTC.key -> v * 1E+8
            CoinEnum.ETH.key -> v * 1E+18
            else -> v
        }).toLong()

        val params = TransactionResponseContent(fromAddress, toAddress, valueInLong)
        params.toString().logAsError("createTx param")
        this.mSoloService.createTx(coinType.toLowerCase(), params).enqueue(object : Callback<TransactionResponse> {
            override fun onResponse(call: Call<TransactionResponse>?, response: Response<TransactionResponse>?) {
                response?.body()?.toString()?.logAsError("createTx response")
//                this@Signer.mSignerListener?.onReceiveSignedTransaction(it.result?.transactionData!!)
            }

            override fun onFailure(call: Call<TransactionResponse>?, t: Throwable?) {
            }
        })
    }

    fun sendTransaction(transactionData: String) {
//        val transaction = SendTransactionRequest(transactionData)
//        this.mRopstenService.sendTransaction(transaction).enqueue(object : Callback<Result> {
//            override fun onResponse(call: Call<Result>, response: Response<Result>) {
//                val result = if (response.body() != null) response.body()?.result!! else ""
//                this@Signer.mSignerListener?.onReceiveSentTransaction(response.isSuccessful, result)
//            }
//
//            override fun onFailure(call: Call<Result>, t: Throwable) {
//                this@Signer.mSignerListener?.onReceiveSentTransaction(false, null!!)
//            }
//        })
    }

    fun handleScheme(intent: Intent) {
        if (TextUtils.equals(intent.scheme, walletScheme)) {
            val data = intent.dataString.split("://")[1]
            val response = SignerResponse.parse(data)
            response?.let {
                when (it.action) {
                    ACTION_GET_WALLET -> {
                        this.myWalletID = it.result?.walletId!!
                        mPreferences?.edit()?.putString(KEY_WALLET_ID, this.myWalletID)?.apply()
                        this.mSignerListener?.onSyncCompleted()
                    }
                    ACTION_SIGN -> {
                        this.mSignerListener?.onReceiveSignedTransaction(it.result?.transactionData!!)
                    }
                    else -> {
                    }
                }
            }
        }
    }

    companion object {
        private const val ACTION_NONE = "NONE"
        private const val ACTION_GET_WALLET = "GET_WALLET"
        private const val ACTION_SIGN = "SIGN"

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
