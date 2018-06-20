package com.biglabs.solo.signer.library;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;

import org.json.JSONObject;

import java.util.Locale;

public class Signer {

    private static final String ACTION_NONE = "NONE";
    private static final String ACTION_GET_USER = "GET_USER";
    private static final String ACTION_SIGN = "SIGN";

    private static Signer instance = null;
    private final Context mContext;
    private final String appId;

    public static synchronized void initialize(Context context, String applicationId) {
        if (instance == null) {
            instance = new Signer(context, applicationId);
        }
    }

    public static synchronized Signer getInstance() {
        if (instance == null) {
            throw new RuntimeException("");
        }
        return instance;
    }

    private Signer(Context context, String appId) {
        this.mContext = context;
        this.appId = appId;
    }

    private String prepareSignerDeepLink(String action, JSONObject params) {
        String receiver = String.format(Locale.ENGLISH, "%s.solowallet", appId);

        JSONObject data = new JSONObject();
        try {
            data.put("action", action);
            data.put("receiver", receiver);
            if (params != null) {
                data.put("params", params);
            }
        } catch (Exception ignored) {
        }
        return String.format(Locale.US, "solosigner://%s", data.toString());
    }

    public void getUserInfo() {

    }

    public void sendTransaction(String fromAddress, String toAddress, String coinType, String value, String msg) {
        try {
            JSONObject params = new JSONObject()
                    .put("from", fromAddress)
                    .put("to", toAddress)
                    .put("coinType", coinType)
                    .put("value", value)
                    .put("txData", msg);
            String signerLink = prepareSignerDeepLink(ACTION_SIGN, params);

            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(signerLink));
            if (intent.resolveActivity(mContext.getPackageManager()) != null) {
                intent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
                mContext.startActivity(intent);
            } else {
                Toast.makeText(mContext, "Could not found SOLO Signer app!", Toast.LENGTH_LONG).show();
            }
        } catch (Exception ignored) {
        }
    }
}
