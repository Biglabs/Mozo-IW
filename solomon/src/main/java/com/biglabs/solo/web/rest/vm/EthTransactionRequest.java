package com.biglabs.solo.web.rest.vm;


import java.math.BigInteger;

/**
 * Created by antt on 7/3/2018.
 */
public class EthTransactionRequest extends TransactionRequest{
    private BigInteger gasPrice;
    private BigInteger gasLimit;

    public BigInteger getGasPrice() {
        return gasPrice;
    }

    public void setGasPrice(BigInteger gasPrice) {
        this.gasPrice = gasPrice;
    }

    public BigInteger getGasLimit() {
        return gasLimit;
    }

    public void setGasLimit(BigInteger gasLimit) {
        this.gasLimit = gasLimit;
    }

}
