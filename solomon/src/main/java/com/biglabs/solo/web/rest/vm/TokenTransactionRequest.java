package com.biglabs.solo.web.rest.vm;


import org.hibernate.validator.constraints.NotEmpty;

import java.math.BigInteger;

/**
 * Created by antt on 7/3/2018.
 */
public class TokenTransactionRequest extends EthTransactionRequest{
    @NotEmpty
    private String contractAddress;


    public String getContractAddress() {
        return contractAddress;
    }

    public void setContractAddress(String contractAddress) {
        this.contractAddress = contractAddress;
    }
}
