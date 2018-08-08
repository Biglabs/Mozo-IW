package com.biglabs.solo.eth.etherscan;

import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * Error String
 * @author <a href="mailto:seb.auvray@gmail.com">Sebastien Auvray</a>
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EscanTransaction extends BCYAddress{
    private String from;
    private String to;
    private BigDecimal value;
    private Long blockNumber;
    private Long confirmations;
    private BigDecimal gasPrice;
    private BigDecimal gas;
    private BigDecimal gasUsed;
    private Long timeStamp;
    private BigInteger nonce;
    private String hash; //tx hash
    private String blockHash;
    private String input;
    private String contractAddress;

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public Long getBlockNumber() {
        return blockNumber;
    }

    public void setBlockNumber(Long blockNumber) {
        this.blockNumber = blockNumber;
    }

    public Long getConfirmations() {
        return confirmations;
    }

    public void setConfirmations(Long confirmations) {
        this.confirmations = confirmations;
    }

    public BigDecimal getGasPrice() {
        return gasPrice;
    }

    public void setGasPrice(BigDecimal gasPrice) {
        this.gasPrice = gasPrice;
    }

    public BigDecimal getGas() {
        return gas;
    }

    public void setGas(BigDecimal gas) {
        this.gas = gas;
    }

    public BigDecimal getGasUsed() {
        return gasUsed;
    }

    public void setGasUsed(BigDecimal gasUsed) {
        this.gasUsed = gasUsed;
    }

    public Long getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Long timeStamp) {
        this.timeStamp = timeStamp;
    }

    public BigInteger getNonce() {
        return nonce;
    }

    public void setNonce(BigInteger nonce) {
        this.nonce = nonce;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public String getBlockHash() {
        return blockHash;
    }

    public void setBlockHash(String blockHash) {
        this.blockHash = blockHash;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getContractAddress() {
        return contractAddress;
    }

    public void setContractAddress(String contractAddress) {
        this.contractAddress = contractAddress;
    }

    @Override
    public String toString() {
        return "EscanTransaction{" +
            "from='" + from + '\'' +
            ", to='" + to + '\'' +
            ", value=" + value +
            ", blockNumber=" + blockNumber +
            ", confirmations=" + confirmations +
            ", gasPrice=" + gasPrice +
            ", gas=" + gas +
            ", gasUsed=" + gasUsed +
            ", timeStamp=" + timeStamp +
            ", nonce=" + nonce +
            ", hash='" + hash + '\'' +
            ", blockHash='" + blockHash + '\'' +
            ", input='" + input + '\'' +
            ", contractAddress='" + contractAddress + '\'' +
            "} " + super.toString();
    }
}
