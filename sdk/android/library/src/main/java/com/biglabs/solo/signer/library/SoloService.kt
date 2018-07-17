package com.biglabs.solo.signer.library

import com.biglabs.solo.signer.library.models.rest.GetBalanceRequest
import com.biglabs.solo.signer.library.models.rest.Result
import com.biglabs.solo.signer.library.models.rest.TransactionResponse
import com.biglabs.solo.signer.library.models.rest.TransactionResponseContent
import com.biglabs.solo.signer.library.models.ui.Wallet
import com.biglabs.solo.signer.library.utils.Constants
import okhttp3.OkHttpClient
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

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
    fun getWalletAddress(@Path("walletID") walletID: String): Call<List<Wallet>>

    @POST("{coin}/test/txs")
    fun createTx(@Path("coin") coin: String, @Body body: TransactionResponseContent): Call<TransactionResponse>

    @POST("./")
    fun getBalance(@Body request: GetBalanceRequest): Call<Result>
}
