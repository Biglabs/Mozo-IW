package com.biglabs.solo.signer.library.models;

import com.google.gson.annotations.SerializedName;

public class Result {
    @SerializedName("jsonrpc")
    private String jsonRpc;

    @SerializedName("id")
    private int id;

    @SerializedName("result")
    private String result;

    public String getJsonRpc() {
        return jsonRpc;
    }

    public int getId() {
        return id;
    }

    public String getResult() {
        return result;
    }
}
