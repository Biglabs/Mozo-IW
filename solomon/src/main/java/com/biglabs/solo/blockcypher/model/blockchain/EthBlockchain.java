package com.biglabs.solo.blockcypher.model.blockchain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class EthBlockchain extends Blockchain {
    @JsonProperty("high_gas_price")
    private long highGasPrice;
    @JsonProperty("medium_gas_price")
    private long mediumGasPrice;
    @JsonProperty("low_gas_price")
    private long lowGasPrice;

    @Override
    public String toString() {
        return "EthBlockchain{" +
            "highGasPrice=" + highGasPrice +
            ", mediumGasPrice=" + mediumGasPrice +
            ", lowGasPrice=" + lowGasPrice +
            '}';
    }

    public long getHighGasPrice() {
        return highGasPrice;
    }

    public void setHighGasPrice(long highGasPrice) {
        this.highGasPrice = highGasPrice;
    }

    public long getMediumGasPrice() {
        return mediumGasPrice;
    }

    public void setMediumGasPrice(long mediumGasPrice) {
        this.mediumGasPrice = mediumGasPrice;
    }

    public long getLowGasPrice() {
        return lowGasPrice;
    }

    public void setLowGasPrice(long lowGasPrice) {
        this.lowGasPrice = lowGasPrice;
    }
}
