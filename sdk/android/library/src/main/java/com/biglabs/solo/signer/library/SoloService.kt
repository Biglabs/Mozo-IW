package com.biglabs.solo.signer.library

import com.biglabs.solo.signer.library.models.Result
import com.biglabs.solo.signer.library.models.Wallet
import okhttp3.OkHttpClient
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface SoloService {

    companion object {
        private const val API_BASE_URL = "http://192.168.1.91:8080/"
        private const val API_INFURA_TESTNET = "https://api.infura.io/v1/jsonrpc/"

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
    }

    @GET("api/solo-wallets")
    fun listWallet(): Call<List<Wallet>>

    @GET("ropsten/eth_getBalance")
    fun getBalance(@Query("params") params: String): Call<Result>

    @POST("ropsten")
    fun sendTransaction(@Body tx: String): Call<Result>
}
