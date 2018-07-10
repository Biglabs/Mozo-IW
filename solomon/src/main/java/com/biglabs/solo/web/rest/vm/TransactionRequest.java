package com.biglabs.solo.web.rest.vm;


import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by antt on 7/3/2018.
 */
public class TransactionRequest {
    @NotEmpty
    private List<TxInput> inputs;
    @NotEmpty
    private List<TxOutput> outputs;
    private BigDecimal fees;
    public List<TxInput> getInputs() {
        return inputs;
    }

    public void setInputs(List<TxInput> inputs) {
        this.inputs = inputs;
    }

    public List<TxOutput> getOutputs() {
        return outputs;
    }

    public void setOutputs(List<TxOutput> outputs) {
        this.outputs = outputs;
    }

    public static class TxInput {
        @NotEmpty
        private List<String> addresses = new ArrayList<String>();

        public List<String> getAddresses() {
            return addresses;
        }

        public void setAddresses(List<String> addresses) {
            this.addresses = addresses;
        }

    }

    public static class TxOutput {
        @NotEmpty
        private List<String> addresses = new ArrayList<String>();
        @NotNull
        private BigDecimal value;

        public BigDecimal getValue() {
            return value;
        }

        public void setValue(BigDecimal value) {
            this.value = value;
        }

        public List<String> getAddresses() {
            return addresses;
        }

        public void setAddresses(List<String> addresses) {
            this.addresses = addresses;
        }
    }
}
