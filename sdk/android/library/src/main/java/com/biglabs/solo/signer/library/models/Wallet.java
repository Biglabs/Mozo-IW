package com.biglabs.solo.signer.library.models;

import com.google.gson.annotations.SerializedName;

public class Wallet {
    @SerializedName("id")
    private String id;

    @SerializedName("walletKey")
    private String key;

    @SerializedName("walletId")
    private String address;

    public String getId() {
        return id;
    }

    public String getKey() {
        return key;
    }

    public String getAddress() {
        return address;
    }
}
