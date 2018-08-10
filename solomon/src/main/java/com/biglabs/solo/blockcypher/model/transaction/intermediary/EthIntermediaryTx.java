package com.biglabs.solo.blockcypher.model.transaction.intermediary;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.validation.constraints.NotNull;
import java.math.BigInteger;

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

}
