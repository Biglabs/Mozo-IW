package com.biglabs.solo.eth;


import com.biglabs.solo.blockcypher.model.transaction.TX_ACTION;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.math.BigInteger;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EthTxHistory {
    public String txHash;
    public Long blockHeight;
    public ETH_TX_ACTION action;
    public BigDecimal fees;
    public BigDecimal amount;
    public Long time;
    public String addressFrom;
    public String addressTo;
    public Long confirmations;
    public String message;
    public String contractAddress;
    public String symbol; //ETH or Token symbol
    public EtherscanRopsten.CONTRACT_ACTION contractAction;
    public BigInteger decimal;


    @Override
    public String toString() {
        return "EthTxHistory{" +
            "txHash='" + txHash + '\'' +
            ", blockHeight=" + blockHeight +
            ", action=" + action +
            ", fees=" + fees +
            ", amount=" + amount +
            ", time=" + time +
            ", addressTo='" + addressTo + '\'' +
            ", confirmations=" + confirmations +
            ", message='" + message + '\'' +
            ", contractAddress='" + contractAddress + '\'' +
            ", symbol='" + symbol + '\'' +
            ", decimal=" + decimal +
            '}';
    }

    public EtherscanRopsten.CONTRACT_ACTION getContractAction() {
        return contractAction;
    }

    public void setContractAction(EtherscanRopsten.CONTRACT_ACTION contractAction) {
        this.contractAction = contractAction;
    }

    public String getAddressFrom() {
        return addressFrom;
    }

    public void setAddressFrom(String addressFrom) {
        this.addressFrom = addressFrom;
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

    public ETH_TX_ACTION getAction() {
        return action;
    }

    public void setAction(ETH_TX_ACTION action) {
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

    public String getContractAddress() {
        return contractAddress;
    }

    public void setContractAddress(String contractAddress) {
        this.contractAddress = contractAddress;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public BigInteger getDecimal() {
        return decimal;
    }

    public void setDecimal(BigInteger decimal) {
        this.decimal = decimal;
    }
}
