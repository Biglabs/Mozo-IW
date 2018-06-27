package com.biglabs.solo.signer.library

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.text.TextUtils
import android.util.Log
import android.widget.Toast
import com.biglabs.solo.signer.library.models.Result
import com.biglabs.solo.signer.library.models.SignerResponse
import com.biglabs.solo.signer.library.models.Transaction
import com.google.gson.Gson
import org.json.JSONArray
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.math.BigDecimal
import java.math.BigInteger
import java.util.*

@Suppress("unused")
class Signer private constructor(private val walletScheme: String) {
    private val mSoloService: SoloService = SoloService.create()
    private var mSignerListener: SignerListener? = null

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

    fun getWallet(context: Context) {
        openDeepLink(context, ACTION_GET_WALLET)
    }

    fun getWallets() {
        this.mSoloService.listWallet()
    }

    fun getBalance(address: String) {
        val params = JSONArray()
                .put(address)
                .put("latest")
        this.mSoloService.getBalance(params.toString()).enqueue(object : Callback<Result> {
            override fun onResponse(call: Call<Result>, response: Response<Result>) {
                if (this@Signer.mSignerListener != null && response.body() != null) {
                    val balance = response.body()!!.result
                    val bigInteger = BigDecimal(BigInteger(balance!!.replace("0x", ""), 16))
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
        val transaction = Transaction(transactionData)
        Log.e("vu", "sendTransaction: " + transaction.toString())
        this.mSoloService.sendTransaction(transaction.toString()).enqueue(object : Callback<Result> {
            override fun onResponse(call: Call<Result>, response: Response<Result>) {
                Log.e("vu", "sendTransaction onResponse: " + response.toString())

                val result = if(response.body() != null) response.body()?.result!! else ""
                this@Signer.mSignerListener?.onReceiveSentTransaction(response.isSuccessful, result)
            }

            override fun onFailure(call: Call<Result>, t: Throwable) {
                Log.e("vu", "sendTransaction: " + t.toString())
                this@Signer.mSignerListener?.onReceiveSentTransaction(false, null!!)
            }
        })
    }

    fun handleScheme(intent: Intent) {
        Log.e("vu", "handleScheme: " + intent.toString())
        if (TextUtils.equals(intent.scheme, walletScheme)) {
            try {
                val data = intent.dataString.split("://")[1]
                val response = Gson().fromJson(data, SignerResponse::class.java)
                when (response.action) {
                    ACTION_GET_WALLET -> {

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
        private const val ACTION_GET_WALLET = "GET_USER"
        private const val ACTION_SIGN = "SIGN"

        @Volatile
        private var instance: Signer? = null

        public fun initialize(context: Context, applicationId: String) {
            if (instance == null) {
                synchronized(this) {
                    if (instance == null) {
                        instance = Signer("$applicationId.solowallet")
                        if (context is SignerListener) {
                            instance!!.mSignerListener = context
                        }
                    }
                }
            }
        }

        @Synchronized
        public fun getInstance(): Signer {
            if (instance == null) {
                throw RuntimeException("Must call Signer.initialize(Context, String) first!")
            }
            return instance as Signer
        }
    }
}
