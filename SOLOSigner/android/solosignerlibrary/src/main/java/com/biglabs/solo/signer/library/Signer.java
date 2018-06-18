package com.biglabs.solo.signer.library;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import java.util.Locale;

public class Signer {
    private static Signer instance = null;
    private SignerListener mListener;

    public static synchronized Signer getInstance() {
        if (instance == null) {
            instance = new Signer();
        }
        return instance;
    }

    void onReceivedResponse(Bundle data) {
        if (data == null) return;

        Log.e("vu", "ServiceResponseHandler: " + data.toString());

        String balance = data.getString("balance", "");
        if (mListener != null) {
            mListener.onReceivedBalance(balance);
        }
    }

    void onServiceError(Exception e) {
        e.printStackTrace();
    }

    public void getBalance(Context context, String address, SignerListener listener) {
        this.mListener = listener;

        Bundle bundle = new Bundle();
        bundle.putString("message", address);
        SignerServiceHelper.getInstance().send(context, bundle);
    }

    public void sendTransaction(Context context, String fromAddress, String toAddress, String value, String msg, String appId) {
        String receiverScheme = "wallet-" + appId;

        String signerLink = String.format(
                Locale.US,
                "solosigner://{\"from\": \"%s\", \"to\": \"%s\", \"value\": \"%s\", \"message\": \"%s\", \"receiver\": \"%s\"}",
                fromAddress, toAddress, value, msg, receiverScheme);

        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(signerLink));
        if (intent.resolveActivity(context.getPackageManager()) != null) {
            intent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
            context.startActivity(intent);
        } else {
            Toast.makeText(context, "Could not found SOLO Signer app!", Toast.LENGTH_LONG).show();
        }
    }
}
