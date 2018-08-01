package com.biglabs.solo.blockcypher.model.transaction.intermediary;


import com.biglabs.solo.blockcypher.model.transaction.Transaction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class EthIntermediaryTx extends IntermediaryTransaction {
    @NotNull
    private BigInteger nonce;

    public BigInteger getNonce() {
        return nonce;
    }

    public void setNonce(BigInteger nonce) {
        this.nonce = nonce;
    }
//
//    public BigInteger getGasPrice() {
//        return gasPrice;
//    }
//
//    public void setGasPrice(BigInteger gasPrice) {
//        this.gasPrice = gasPrice;
//    }
//
//    public BigInteger getGasLimit() {
//        return gasLimit;
//    }
//
//    public void setGasLimit(BigInteger gasLimit) {
//        this.gasLimit = gasLimit;
//    }
}
