package com.biglabs.solo.signer.library.models.scheme

import com.google.gson.Gson
import com.google.gson.annotations.SerializedName

internal class SignerResponse {
    companion object {
        @JvmStatic
        fun parse(json: String): SignerResponse? {
            return try {
                Gson().fromJson(json, SignerResponse::class.java)
            } catch (_: Exception) {
                null
            }
        }
    }

    @SerializedName("action")
    var action: String? = null

    @SerializedName("result")
    var result: SignerResponseResult? = null
}