package com.biglabs.solo.signer.library;

import com.biglabs.solo.signer.library.models.Wallet;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;

public interface SignerService {

    @GET("api/solo-wallets")
    Call<List<Wallet>> listWallet();
}
