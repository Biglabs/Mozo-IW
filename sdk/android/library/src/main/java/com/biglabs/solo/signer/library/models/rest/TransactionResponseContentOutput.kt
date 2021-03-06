package com.biglabs.solo.signer.library.models.rest

import com.google.gson.annotations.SerializedName

internal class TransactionResponseContentOutput {

    constructor() {}

    constructor(address: String, value: Long) {
        this.addresses = arrayOf(address)
        this.value = value
    }

    /** Addresses that correspond to this output; typically this will only have a single address, and you can think of this output as having “sent” value to the address contained herein. */
    @SerializedName("addresses")
    var addresses: Array<String>? = null

    /** Raw hexadecimal encoding of the encumbrance script for this output. */
    @SerializedName("script")
    var script: String? = null

    /** BTC: Value in this transaction output, in satoshis. 10^8
        ETH: Value in this transaction output, in wei. 10^18 */
    @SerializedName("value")
    var value: Long? = null

    /** The type of script that encumbers the output corresponding to this input. */
    @SerializedName("script_type")
    var scriptType: String? = null

    /** Optional The transaction hash that spent this output. Only returned for outputs that have been spent. The spending transaction may be unconfirmed. */
    @SerializedName("spent_by")
    var spentBy: String? = null

    /** Optional A hex-encoded representation of an OP_RETURN data output, without any other script instructions. Only returned for outputs whose script_type is null-data. */
    @SerializedName("data_hex")
    var dataHex: String? = null

    /** Optional An ASCII representation of an OP_RETURN data output, without any other script instructions. Only returned for outputs whose script_type is null-data and if its data falls into the visible ASCII range. */
    @SerializedName("data_string")
    var dataString: String? = null
}