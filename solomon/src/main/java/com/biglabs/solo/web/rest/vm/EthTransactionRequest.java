package com.biglabs.solo.web.rest.vm;


import com.biglabs.solo.blockcypher.model.transaction.input.Input;
import com.biglabs.solo.blockcypher.model.transaction.output.Output;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

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
