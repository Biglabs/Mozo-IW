package com.biglabs.solo.signer.library;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.support.annotation.NonNull;
import android.util.Log;
import android.widget.Toast;

import com.biglabs.solo.signer.library.models.Result;
import com.biglabs.solo.signer.library.models.Transaction;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Locale;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class Signer {

    private static final String API_BASE_URL = "http://192.168.1.91:8080/";
    private static final String API_INFURA_TESTNET = "https://api.infura.io/v1/jsonrpc/";

    public static final String ACTION_NONE = "NONE";
    public static final String ACTION_GET_USER = "GET_USER";
    public static final String ACTION_SIGN = "SIGN";

    private static Signer instance = null;
    private final Context mContext;
    private final String appId;
    private final SignerService mSignerService;
    private SignerListener mListener;

    public static synchronized void initialize(Context context, String applicationId) {
        if (instance == null) {
            instance = new Signer(context, applicationId);
        }
    }

    public static synchronized Signer getInstance() {
        if (instance == null) {
            throw new RuntimeException("Must call Signer.initialize(Context, String) first!");
        }
        return instance;
    }

    private Signer(Context context, String appId) {
        this.mContext = context;
        this.appId = appId;

        OkHttpClient.Builder httpClient = new OkHttpClient.Builder();
        httpClient.addInterceptor(new Interceptor() {
            @Override
            public okhttp3.Response intercept(Chain chain) throws IOException {
                return chain.proceed(chain.request().newBuilder()
                        .addHeader("Content-Type", "application/json")
                        .addHeader("Accept", "application/json")
                        .build());
            }
        });
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(API_INFURA_TESTNET)
                .addConverterFactory(GsonConverterFactory.create())

                .build();
        this.mSignerService = retrofit.create(SignerService.class);
    }

    private String prepareSignerDeepLink(String action, String coinType, JSONObject params) {
        String receiver = String.format(Locale.ENGLISH, "%s.solowallet", appId);

        JSONObject data = new JSONObject();
        try {
            data.put("action", action);
            data.put("receiver", receiver);
            if (coinType != null) {
                data.put("coinType", coinType);
            }
            if (params != null) {
                data.put("params", params);
            }
        } catch (Exception ignored) {
        }
        return String.format(Locale.US, "solosigner://%s", data.toString());
    }

    private void openDeepLink(String action) {
        openDeepLink(action, null, null);
    }

    private void openDeepLink(String action, String coinType, JSONObject params) {
        String signerLink = prepareSignerDeepLink(action, coinType, params);
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(signerLink));
        if (intent.resolveActivity(mContext.getPackageManager()) != null) {
            intent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
            mContext.startActivity(intent);
        } else {
            Toast.makeText(mContext, "Could not found SOLO Signer app!", Toast.LENGTH_LONG).show();
        }
    }

    public void getUserInfo() {
        openDeepLink(ACTION_GET_USER);
    }

    public void getWallets() {
        this.mSignerService.listWallet();
    }

    public void getBalance(String address, SignerListener listener) {
        this.mListener = listener;

        JSONArray params = new JSONArray()
                .put(address)
                .put("latest");
        this.mSignerService.getBalance(params.toString()).enqueue(new Callback<Result>() {
            @Override
            public void onResponse(@NonNull Call<Result> call, @NonNull Response<Result> response) {
                if (Signer.this.mListener != null && response.body() != null) {
                    String balance = response.body().getResult();
                    BigDecimal bigInteger = new BigDecimal(new BigInteger(balance.replace("0x", ""), 16));
                    BigDecimal balanceInEther = bigInteger.divide(new BigDecimal("1000000000000000000"));
                    Signer.this.mListener.onReceivedBalance(balanceInEther.toString());
                    Signer.this.mListener = null;
                }
            }

            @Override
            public void onFailure(@NonNull Call<Result> call, @NonNull Throwable t) {
                Signer.this.mListener.onReceivedBalance(t.getMessage());
                Signer.this.mListener = null;
            }
        });
    }

    public void confirmTransaction(String fromAddress, String toAddress, String coinType, String value, String msg) {
        try {
            JSONObject params = new JSONObject()
                    .put("from", fromAddress)
                    .put("to", toAddress)
                    .put("value", value)
                    .put("txData", msg);

            openDeepLink(ACTION_SIGN, coinType, params);
        } catch (Exception ignored) {
        }
    }

    public void sendTransaction(String transactionData, SignerListener listener) {
        this.mListener = listener;
        Transaction transaction = new Transaction(transactionData);
        Log.e("vu", "sendTransaction: " + transaction.toString());
        this.mSignerService.sendTransaction(transaction.toString()).enqueue(new Callback<Result>() {
            @Override
            public void onResponse(@NonNull Call<Result> call, @NonNull Response<Result> response) {
                Log.e("vu", "sendTransaction onResponse: " + response.toString());
                if (Signer.this.mListener != null) {
                    String txHash = response.body() != null ? response.body().getResult() : null;
                    Signer.this.mListener.onTransactionSent(response.isSuccessful(), txHash);
                    Signer.this.mListener = null;
                }
            }

            @Override
            public void onFailure(@NonNull Call<Result> call, @NonNull Throwable t) {
                Log.e("vu", "sendTransaction: " + t.toString());
                if (Signer.this.mListener != null) {
                    Signer.this.mListener.onTransactionSent(false, null);
                    Signer.this.mListener = null;
                }
            }
        });
    }
}
