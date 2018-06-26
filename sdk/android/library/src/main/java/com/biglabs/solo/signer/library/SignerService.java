package com.biglabs.solo.signer.library;

import com.biglabs.solo.signer.library.models.Result;
import com.biglabs.solo.signer.library.models.Transaction;
import com.biglabs.solo.signer.library.models.Wallet;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface SignerService {

    @GET("api/solo-wallets")
    Call<List<Wallet>> listWallet();

    @GET("ropsten/eth_getBalance")
    Call<Result> getBalance(@Query("params") String params);

    @POST("ropsten")
    Call<Result> sendTransaction(@Body String tx);
}
