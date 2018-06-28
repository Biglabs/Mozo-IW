package com.biglabs.solo.signer.library

import com.biglabs.solo.signer.library.models.GetBalanceRequest
import com.biglabs.solo.signer.library.models.Result
import com.biglabs.solo.signer.library.models.SendTransactionRequest
import com.biglabs.solo.signer.library.models.Wallet
import okhttp3.OkHttpClient
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface SoloService {

    companion object {
        private const val API_BASE_URL = "http://192.168.1.98:9000/api/"
        private const val API_INFURA_TESTNET = "https://ropsten.infura.io/Onb2hCxHKDYIL0LNn8Ir/"

        fun create(): SoloService {
            val httpClient = OkHttpClient.Builder()
            httpClient.addInterceptor { chain ->
                chain.proceed(chain.request().newBuilder()
                        .addHeader("Content-Type", "application/json")
                        .addHeader("Accept", "application/json")
                        .build())
            }
            val retrofit = Retrofit.Builder()
                    .baseUrl(API_INFURA_TESTNET)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(httpClient.build())
                    .build()
            return retrofit.create(SoloService::class.java)
        }

        fun createSolo(): SoloService {
            val httpClient = OkHttpClient.Builder()
            httpClient.addInterceptor { chain ->
                chain.proceed(chain.request().newBuilder()
                        .addHeader("Content-Type", "application/json")
                        .addHeader("Accept", "application/json")
                        .build())
            }
            val retrofit = Retrofit.Builder()
                    .baseUrl(API_BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(httpClient.build())
                    .build()
            return retrofit.create(SoloService::class.java)
        }
    }

    @GET("wallets/{walletID}/addresses")
    fun getWalletAddress(@Path("walletID") walletID: String): Call<List<Wallet>>

    @POST("./")
    fun getBalance(@Body request: GetBalanceRequest): Call<Result>

    @POST("./")
    fun sendTransaction(@Body tx: SendTransactionRequest): Call<Result>
}
