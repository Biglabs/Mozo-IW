package com.biglabs.solo.signer.library.models.rest

import com.google.gson.annotations.SerializedName

internal class TransactionResponseContentInput {

    constructor() {

    }

    constructor(address: String) {
        this.addresses = arrayOf(address)
    }

    /** An array of public addresses associated with the output of the previous transaction. */
    @SerializedName("addresses")
    var addresses: Array<String>? = null

    /** The previous transaction hash where this input was an output. Not present for coinbase transactions. */
    @SerializedName("prev_hash")
    var prevHash: String? = null

    /** The index of the output being spent within the previous transaction. Not present for coinbase transactions. */
    @SerializedName("output_index")
    var outputIndex: Long? = null

    /** The value of the output being spent within the previous transaction. Not present for coinbase transactions. */
    @SerializedName("output_value")
    var outputValue: Long? = null

    /** The type of script that encumbers the output corresponding to this input. */
    @SerializedName("script_type")
    var scriptType: String? = null

    /** Raw hexadecimal encoding of the script. */
    @SerializedName("script")
    var script: String? = null

    /** Legacy 4-byte sequence number, not usually relevant unless dealing with locktime encumbrances. */
    @SerializedName("sequence")
    var sequence: Long? = null
}