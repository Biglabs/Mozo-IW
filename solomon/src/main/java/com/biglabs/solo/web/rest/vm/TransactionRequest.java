package com.biglabs.solo.web.rest.vm;


import com.biglabs.solo.blockcypher.model.transaction.input.Input;
import com.biglabs.solo.blockcypher.model.transaction.output.Output;
import jnr.ffi.annotations.Out;
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

    public BigDecimal getFees() {
        return fees;
    }

    public void setFees(BigDecimal fees) {
        this.fees = fees;
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

        public Input toInput() {
            Input ret = new Input();
            ret.setAddresses(this.getAddresses());
            return ret;
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

        public Output toOutput() {
            Output ret = new Output();
            ret.setAddresses(this.addresses);
            ret.setValue(this.value);
            return ret;
        }
    }
}
