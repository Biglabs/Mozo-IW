package com.biglabs.solo.signer.library.models.new

import com.google.gson.annotations.SerializedName

class IntermediaryTransactionDTO {
    /** A temporary TX, usually returned fully filled. */
    @SerializedName("tx")
    var tx: TransactionDTO? = null

    /** Array of hex-encoded data for you to sign, containing one element for you to sign. Still an array to maintain parity with the Bitcoin API. */
    @SerializedName("tosign")
    var tosign: [String]? = null

    /** Array of signatures corresponding to all the data in tosign, typically provided by you. Only one signature is required. */
    @SerializedName("signatures")
    var signatures: [String]? = null

    /** Array of public keys corresponding to each signature. In general, these are provided by you, and correspond to the signatures you provide. */
    @SerializedName("pubkeys")
    var pubkeys: [String]? = null

    /** Optional Array of errors in the form “error”:“description-of-error”. 
    This is only returned if there was an error in any stage of transaction generation, and is usually accompanied by a HTTP 400 code. */
    @SerializedName("errors")
    var errors: [String]? = null
}