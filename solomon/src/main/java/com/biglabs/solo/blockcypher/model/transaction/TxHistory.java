package com.biglabs.solo.blockcypher.model.transaction;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TxHistory {
    public String txHash;
    public Long blockHeight;
    public TX_ACTION action;
    public BigDecimal fees;
    public BigDecimal amount;
    public Long time;
    public String addressTo;
    public Long confirmations;
    public String message;

    @Override
    public String toString() {
        return "TxHistory{" +
            "txHash='" + txHash + '\'' +
            ", blockHeight=" + blockHeight +
            ", action=" + action +
            ", fees=" + fees +
            ", amount=" + amount +
            ", time=" + time +
            ", addressTo='" + addressTo + '\'' +
            ", confirmations=" + confirmations +
            ", message='" + message + '\'' +
            '}';
    }

    public String getTxHash() {
        return txHash;
    }

    public void setTxHash(String txHash) {
        this.txHash = txHash;
    }

    public Long getBlockHeight() {
        return blockHeight;
    }

    public void setBlockHeight(Long blockHeight) {
        this.blockHeight = blockHeight;
    }

    public TX_ACTION getAction() {
        return action;
    }

    public void setAction(TX_ACTION action) {
        this.action = action;
    }

    public BigDecimal getFees() {
        return fees;
    }

    public void setFees(BigDecimal fees) {
        this.fees = fees;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    public String getAddressTo() {
        return addressTo;
    }

    public void setAddressTo(String addressTo) {
        this.addressTo = addressTo;
    }

    public Long getConfirmations() {
        return confirmations;
    }

    public void setConfirmations(Long confirmations) {
        this.confirmations = confirmations;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
