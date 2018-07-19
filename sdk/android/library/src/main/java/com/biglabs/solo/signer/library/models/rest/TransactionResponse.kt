package com.biglabs.solo.signer.library.models.rest

import com.google.gson.Gson
import com.google.gson.annotations.SerializedName

internal class TransactionResponse {
    companion object {
        @JvmStatic
        fun parse(json: String): TransactionResponse? {
            return try {
                Gson().fromJson(json, TransactionResponse::class.java)
            } catch (_: Exception) {
                null
            }
        }
    }

    /** A temporary TX, usually returned fully filled. */
    @SerializedName("tx")
    var tx: TransactionResponseContent? = null

    /** Array of hex-encoded data for you to sign, containing one element for you to sign. Still an array to maintain parity with the Bitcoin API. */
    @SerializedName("tosign")
    var tosign: Array<String>? = null

    /** Array of signatures corresponding to all the data in tosign, typically provided by you. Only one signature is required. */
    @SerializedName("signatures")
    var signatures: Array<String>? = null

    /** Array of public keys corresponding to each signature. In general, these are provided by you, and correspond to the signatures you provide. */
    @SerializedName("pubkeys")
    var pubkeys: Array<String>? = null

    /** Optional Array of errors in the form “error”:“description-of-error”.
    This is only returned if there was an error in any stage of transaction generation, and is usually accompanied by a HTTP 400 code. */
    @SerializedName("errors")
    var errors: Array<String>? = null

    override fun toString(): String {
        return Gson().toJson(this)
    }
}