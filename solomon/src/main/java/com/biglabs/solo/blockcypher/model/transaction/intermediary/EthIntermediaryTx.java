package com.biglabs.solo.blockcypher.model.transaction.intermediary;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.validation.constraints.NotNull;
import java.math.BigInteger;

@JsonIgnoreProperties(ignoreUnknown = true)
public class EthIntermediaryTx extends IntermediaryTransaction {
    @NotNull
    private BigInteger nonce;
    private String contractAddress;

    public BigInteger getNonce() {
        return nonce;
    }

    public void setNonce(BigInteger nonce) {
        this.nonce = nonce;
    }

    public String getContractAddress() {
        return contractAddress;
    }

    public void setContractAddress(String contractAddress) {
        this.contractAddress = contractAddress;
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
