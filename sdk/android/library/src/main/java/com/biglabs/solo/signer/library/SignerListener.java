package com.biglabs.solo.signer.library;

public abstract class SignerListener {
    public void onReceivedBalance(String balance) {

    }

    public void onTransactionSent(boolean isSuccess, String txHash) {

    }
}
