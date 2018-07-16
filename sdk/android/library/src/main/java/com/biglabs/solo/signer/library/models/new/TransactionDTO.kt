package com.biglabs.solo.signer.library.models.new

import com.google.gson.annotations.SerializedName

class TransactionDTO {
    /** Height of the block that contains this transaction. If this is an unconfirmed transaction, it will equal -1. */
    @SerializedName("block_height")
    var block_height: long? = null

    /** BTC: The hash of the transaction. While reasonably unique, using hashes as identifiers may be unsafe.
        ETH: The hash of the transaction. */
    @SerializedName("hash")
    var hash: String? = null

    /** Array of public addresses involved in the transaction. */
    @SerializedName("addresses")
    var addresses: [String]? = null

    /** BTC: The total number of satoshis exchanged in this transaction.
        ETH: The total number of wei exchanged in this transaction. */
    @SerializedName("total")
    var total: long? = null

    /** BTC: The total number of fees—in satoshis—collected by miners in this transaction.
        ETH: The total number of fees—in wei—collected by miners in this transaction. Equal to gas_price * gas_used. */
    @SerializedName("fees")
    var fees: long? = null
    
    /** The size of the transaction in bytes. */
    @SerializedName("size")     
    var size: long? = null
    
    /** BTC only: The likelihood that this transaction will make it to the next block; reflects the preference level miners have to include this transaction. Can be high, medium or low. */
    @SerializedName("preference")     
    var preference: String? = null
    
    /** ETH only: The amount of gas used by this transaction. */
    @SerializedName("gas_used")     
    var gas_used: long? = null
    
    /** ETH only: The price of gas—in wei—in this transaction. */
    @SerializedName("gas_price")     
    var gas_price: long? = null
    
    /** BTC: Address of the peer that sent BlockCypher’s servers this transaction. 
        ETH: Address of the peer that sent BlockCypher’s servers this transaction. May be empty. */
    @SerializedName("relayed_by")     
    var relayed_by: String? = null
    
    /** Time this transaction was received by BlockCypher’s servers. */
    @SerializedName("received")     
    var received: String? = null
    
    /** BTC: Version number, typically 1 for Bitcoin transactions. 
        ETH: Version number of this transaction. */
    @SerializedName("ver")     
    var ver: long? = null
    
    /** BTC only: Time when transaction can be valid. Can be interpreted in two ways: if less than 500 million, refers to block height. If more, refers to Unix epoch time. */
    @SerializedName("lock_time")     
    var lock_time: long? = null
    
    /** true if this is an attempted double spend; false otherwise. */
    @SerializedName("double_spend")    
    var double_spend: Bool? = null
    
    /** Total number of inputs in the transaction. */
    @SerializedName("vin_sz")     
    var vin_sz: long? = null
    
    /** Total number of outputs in the transaction. */
    @SerializedName("vout_sz")     
    var vout_sz: long? = null
    
    /** Number of subsequent blocks, including the block the transaction is in. Unconfirmed transactions have 0 confirmations. */
    @SerializedName("confirmations")     
    var confirmations: long? = null
    
    /** TXInput Array, limited to 20 by default. */
    @SerializedName("inputs")     
    var inputs: [InputDTO]? = null

    /** TXOutput Array, limited to 20 by default. */
    @SerializedName("outputs")     
    var outputs: [OutputDTO]? = null
    
    /** Optional If creating a transaction, can optionally set a higher default gas limit (useful if your recepient is a contract). 
    If not set, default is 21000 gas for external accounts and 80000 for contract accounts. */
    @SerializedName("gas_limit")     
    var gas_limit: long? = null
}