package com.biglabs.solo.signer.library

import android.app.Activity
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.net.Uri
import android.text.TextUtils
import android.widget.Toast
import com.biglabs.solo.signer.library.models.*
import com.google.gson.Gson
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.math.BigDecimal
import java.math.BigInteger
import java.util.*

@Suppress("unused")
class Signer private constructor(private val walletScheme: String) {
    private val mRopstenService: SoloService = SoloService.create()
    private val mSoloService: SoloService = SoloService.createSolo()
    private var mSignerListener: SignerListener? = null
    private var mPreferences: SharedPreferences? = null
    private var myAccountID: String? = null

    private fun prepareSignerDeepLink(action: String, coinType: String?, params: JSONObject?): String {
        val data = JSONObject()
        try {
            data.put("action", action)
            data.put("receiver", walletScheme)
            if (coinType != null) {
                data.put("coinType", coinType)
            }
            if (params != null) {
                data.put("params", params)
            }
        } catch (ignored: Exception) {
        }

        return String.format(Locale.US, "solosigner://%s", data.toString())
    }

    private fun openDeepLink(context: Context, action: String, coinType: String? = null, params: JSONObject? = null) {
        val signerLink = prepareSignerDeepLink(action, coinType, params)
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(signerLink))
        if (intent.resolveActivity(context.packageManager) != null) {
            intent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS)
            context.startActivity(intent)
        } else {
            Toast.makeText(context, "Could not found SOLO Signer app!", Toast.LENGTH_LONG).show()
        }
    }

    private fun handShakeWithSignerApp(context: Context) {
        this.myAccountID = mPreferences!!.getString(KEY_ACCOUNT_ID, null)
        if (this.myAccountID == null) {
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
        if (myAccountID != null) {
            this.mSoloService.getWalletAddress(myAccountID!!).enqueue(object : Callback<List<Wallet>> {
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
        this.mRopstenService.getBalance(params).enqueue(object : Callback<Result> {
            override fun onResponse(call: Call<Result>, response: Response<Result>) {
                if (this@Signer.mSignerListener != null && response.body() != null) {
                    val result = if (response.body()!!.result != null) response.body()!!.result else "0"
                    val bigInteger = BigDecimal(BigInteger(result!!.replace("0x", ""), 16))
                    val balanceInEther = bigInteger.divide(BigDecimal("1000000000000000000"))
                    this@Signer.mSignerListener!!.onReceiveBalance(balanceInEther.toString())
                }
            }

            override fun onFailure(call: Call<Result>, t: Throwable) {
                this@Signer.mSignerListener!!.onReceiveBalance(t.message!!)
            }
        })
    }

    fun confirmTransaction(context: Context, fromAddress: String, toAddress: String, coinType: String, value: String, msg: String) {
        try {
            val params = JSONObject()
                    .put("from", fromAddress)
                    .put("to", toAddress)
                    .put("value", value)
                    .put("txData", msg)

            openDeepLink(context, ACTION_SIGN, coinType, params)
        } catch (ignored: Exception) {
        }
    }

    fun sendTransaction(transactionData: String) {
        val transaction = SendTransactionRequest(transactionData)
        this.mRopstenService.sendTransaction(transaction).enqueue(object : Callback<Result> {
            override fun onResponse(call: Call<Result>, response: Response<Result>) {
                val result = if (response.body() != null) response.body()?.result!! else ""
                this@Signer.mSignerListener?.onReceiveSentTransaction(response.isSuccessful, result)
            }

            override fun onFailure(call: Call<Result>, t: Throwable) {
                this@Signer.mSignerListener?.onReceiveSentTransaction(false, null!!)
            }
        })
    }

    fun handleScheme(intent: Intent) {
        if (TextUtils.equals(intent.scheme, walletScheme)) {
            try {
                val data = intent.dataString.split("://")[1]
                val response = Gson().fromJson(data, SignerResponse::class.java)
                when (response.action) {
                    ACTION_GET_WALLET -> {
                        this.myAccountID = response.result?.accountID!!
                        mPreferences?.edit()?.putString(KEY_ACCOUNT_ID, this.myAccountID)?.apply()
                        this.mSignerListener?.onSyncCompleted()
                    }
                    ACTION_SIGN -> {
                        this.mSignerListener?.onReceiveSignedTransaction(response.result?.transactionData!!)
                    }
                }
            } catch (ex: Exception) {
            }
        }
    }

    companion object {
        private const val ACTION_NONE = "NONE"
        private const val ACTION_GET_WALLET = "GET_WALLET"
        private const val ACTION_SIGN = "SIGN"

        private const val KEY_ACCOUNT_ID = "KEY_ACCOUNT_ID"

        @Volatile
        private var instance: Signer? = null

        fun initialize(context: Context, listener: SignerListener, applicationId: String) {
            if (instance == null) {
                synchronized(this) {
                    if (instance == null) {
                        val walletScheme = "$applicationId.solowallet"
                        instance = Signer(walletScheme)
                        instance!!.mSignerListener = listener
                        instance!!.mPreferences = context.getSharedPreferences(walletScheme, Context.MODE_PRIVATE)
                        instance!!.handShakeWithSignerApp(context)
                    }
                }
            }else{
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
