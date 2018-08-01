package com.biglabs.solo.signer.library

import com.biglabs.solo.signer.library.models.rest.BalanceResponse
import com.biglabs.solo.signer.library.models.rest.TransactionResponse
import com.biglabs.solo.signer.library.models.rest.TransactionResponseContent
import com.biglabs.solo.signer.library.models.ui.TransactionHistory
import com.biglabs.solo.signer.library.models.ui.Wallet
import com.biglabs.solo.signer.library.utils.Constants
import okhttp3.OkHttpClient
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

internal interface SoloService {

    companion object {
        fun create(): SoloService {
            val httpClient = OkHttpClient.Builder()
            httpClient.addInterceptor { chain ->
                chain.proceed(chain.request().newBuilder()
                        .addHeader("Content-Type", "application/json")
                        .addHeader("Accept", "application/json")
                        .build())
            }
            val retrofit = Retrofit.Builder()
                    .baseUrl(Constants.API_BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(httpClient.build())
                    .build()
            return retrofit.create(SoloService::class.java)
        }
    }

    @GET("wallets/{walletID}/addresses")
    fun getWalletAddress(@Path("walletID") walletID: String, @Query("inUse") inUse: Boolean = true): Call<List<Wallet>>

    @GET("{coin}/{network}/addrs/{address}/balance")
    fun getBalance(@Path("coin") coin: String, @Path("network") network: String, @Path("address") address: String): Call<BalanceResponse>

    @GET("{coin}/{network}/addrs/{address}/txhistory")
    fun getTxHistory(@Path("coin") coin: String, @Path("network") network: String, @Path("address") address: String): Call<List<TransactionHistory>>

    @GET("{coin}/{network}/addrs/{address}/txhistory")
    fun getTxHistory(@Path("coin") coin: String, @Path("network") network: String, @Path("address") address: String, @Query("beforeHeight") beforeHeight: Int): Call<List<TransactionHistory>>

    @POST("{coin}/{network}/txs")
    fun createTx(@Path("coin") coin: String, @Path("network") network: String, @Body body: TransactionResponseContent): Call<TransactionResponse>

    @POST("{coin}/{network}/txs/send-signed-tx")
    fun sendTx(@Path("coin") coin: String, @Path("network") network: String, @Body body: TransactionResponse): Call<TransactionResponse>
}
