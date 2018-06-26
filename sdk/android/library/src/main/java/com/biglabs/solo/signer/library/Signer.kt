package com.biglabs.solo.signer.library

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import android.widget.Toast

import com.biglabs.solo.signer.library.models.Result
import com.biglabs.solo.signer.library.models.Transaction

import org.json.JSONArray
import org.json.JSONObject

import java.io.IOException
import java.math.BigDecimal
import java.math.BigInteger
import java.util.Locale

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class Signer private constructor(private val mContext: Context, private val appId: String) {
    private val mSoloService: SoloService = SoloService.create()
    private var mListener: SignerListener? = null

    private fun prepareSignerDeepLink(action: String, coinType: String?, params: JSONObject?): String {
        val receiver = String.format(Locale.ENGLISH, "%s.solowallet", appId)

        val data = JSONObject()
        try {
            data.put("action", action)
            data.put("receiver", receiver)
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

    private fun openDeepLink(action: String, coinType: String? = null, params: JSONObject? = null) {
        val signerLink = prepareSignerDeepLink(action, coinType, params)
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(signerLink))
        if (intent.resolveActivity(mContext.packageManager) != null) {
            intent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS)
            mContext.startActivity(intent)
        } else {
            Toast.makeText(mContext, "Could not found SOLO Signer app!", Toast.LENGTH_LONG).show()
        }
    }

    fun getUserInfo() {
        openDeepLink(ACTION_GET_USER)
    }

    fun getWallets() {
        this.mSoloService.listWallet()
    }

    fun getBalance(address: String, listener: SignerListener) {
        this.mListener = listener

        val params = JSONArray()
                .put(address)
                .put("latest")
        this.mSoloService.getBalance(params.toString()).enqueue(object : Callback<Result> {
            override fun onResponse(call: Call<Result>, response: Response<Result>) {
                if (this@Signer.mListener != null && response.body() != null) {
                    val balance = response.body()!!.result
                    val bigInteger = BigDecimal(BigInteger(balance!!.replace("0x", ""), 16))
                    val balanceInEther = bigInteger.divide(BigDecimal("1000000000000000000"))
                    this@Signer.mListener!!.onReceivedBalance(balanceInEther.toString())
                    this@Signer.mListener = null
                }
            }

            override fun onFailure(call: Call<Result>, t: Throwable) {
                this@Signer.mListener!!.onReceivedBalance(t.message!!)
                this@Signer.mListener = null
            }
        })
    }

    fun confirmTransaction(fromAddress: String, toAddress: String, coinType: String, value: String, msg: String) {
        try {
            val params = JSONObject()
                    .put("from", fromAddress)
                    .put("to", toAddress)
                    .put("value", value)
                    .put("txData", msg)

            openDeepLink(ACTION_SIGN, coinType, params)
        } catch (ignored: Exception) {
        }

    }

    fun sendTransaction(transactionData: String, listener: SignerListener) {
        this.mListener = listener
        val transaction = Transaction(transactionData)
        Log.e("vu", "sendTransaction: " + transaction.toString())
        this.mSoloService.sendTransaction(transaction.toString()).enqueue(object : Callback<Result> {
            override fun onResponse(call: Call<Result>, response: Response<Result>) {
                Log.e("vu", "sendTransaction onResponse: " + response.toString())
                if (this@Signer.mListener != null) {
                    val txHash = if (response.body() != null) response.body()!!.result else null
                    this@Signer.mListener!!.onTransactionSent(response.isSuccessful, txHash!!)
                    this@Signer.mListener = null
                }
            }

            override fun onFailure(call: Call<Result>, t: Throwable) {
                Log.e("vu", "sendTransaction: " + t.toString())
                if (this@Signer.mListener != null) {
                    this@Signer.mListener!!.onTransactionSent(false, null!!)
                    this@Signer.mListener = null
                }
            }
        })
    }

    companion object {
        val ACTION_NONE = "NONE"
        val ACTION_GET_USER = "GET_USER"
        val ACTION_SIGN = "SIGN"

        private var instance: Signer? = null

        @Synchronized
        fun initialize(context: Context, applicationId: String) {
            if (instance == null) {
                instance = Signer(context, applicationId)
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
