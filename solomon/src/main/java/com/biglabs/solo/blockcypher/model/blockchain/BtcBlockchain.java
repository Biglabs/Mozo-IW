package com.biglabs.solo.blockcypher.model.blockchain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BtcBlockchain extends Blockchain {
    @JsonProperty("high_fee_per_kb")
    private long highFeePerKb;
    @JsonProperty("medium_fee_per_kb")
    private long mediumFeePerKb;
    @JsonProperty("low_fee_per_kb")
    private long lowFeePerKb;

    @Override
    public String toString() {
        return "BtcBlockchain{" +
            "highFeePerKb=" + highFeePerKb +
            ", mediumFeePerKb=" + mediumFeePerKb +
            ", lowFeePerKb=" + lowFeePerKb +
            '}';
    }

    public long getHighFeePerKb() {
        return highFeePerKb;
    }

    public void setHighFeePerKb(long highFeePerKb) {
        this.highFeePerKb = highFeePerKb;
    }

    public long getMediumFeePerKb() {
        return mediumFeePerKb;
    }

    public void setMediumFeePerKb(long mediumFeePerKb) {
        this.mediumFeePerKb = mediumFeePerKb;
    }

    public long getLowFeePerKb() {
        return lowFeePerKb;
    }

    public void setLowFeePerKb(long lowFeePerKb) {
        this.lowFeePerKb = lowFeePerKb;
    }

}
