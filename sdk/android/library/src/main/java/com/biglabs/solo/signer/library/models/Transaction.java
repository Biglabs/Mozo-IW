package com.biglabs.solo.signer.library.models;

import com.google.gson.Gson;

public class Transaction {
    private int id;
    private String method;
    private String[] params;

    public Transaction(String transactionData) {
        this.id = 0;
        this.method = "eth_sendRawTransaction";
        this.params = new String[]{transactionData};
    }

    @Override
    public String toString() {
        return new Gson().toJson(this);
    }
}
