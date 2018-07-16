package com.biglabs.solo.signer.library.models.new

import com.google.gson.annotations.SerializedName

class InputDTO {
    /** An array of public addresses associated with the output of the previous transaction. */
    @SerializedName("addresses")
    var addresses: [String]? = null

    /** The previous transaction hash where this input was an output. Not present for coinbase transactions. */
    @SerializedName("prev_hash")
    var prev_hash: String? = null

    /** The index of the output being spent within the previous transaction. Not present for coinbase transactions. */
    @SerializedName("output_index")
    var output_index: long? = null

    /** The value of the output being spent within the previous transaction. Not present for coinbase transactions. */
    @SerializedName("output_value")
    var output_value: long? = null

    /** The type of script that encumbers the output corresponding to this input. */
    @SerializedName("script_type")
    var script_type: String? = null
    
    /** Raw hexadecimal encoding of the script. */
    @SerializedName("script")     
    var script: String? = null
    
    /** Legacy 4-byte sequence number, not usually relevant unless dealing with locktime encumbrances. */
    @SerializedName("sequence")     
    var sequence: long? = null
}