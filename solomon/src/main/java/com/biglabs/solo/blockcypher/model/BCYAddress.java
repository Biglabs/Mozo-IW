package com.biglabs.solo.blockcypher.model;

import com.biglabs.solo.blockcypher.model.transaction.Transaction;
import com.biglabs.solo.blockcypher.model.transaction.summary.TransactionSummary;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;

/**
 * Created by antt on 6/27/2018.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class BCYAddress {
    private static final Logger logger = LoggerFactory.getLogger(BCYAddress.class);

    private String address;
    private BigDecimal balance;
    private BigDecimal final_balance;
    private BigDecimal unconfirmed_balance;
    private Long n_tx;
    private Long unconfirmed_n_tx;
    private String tx_url;
    private List<Transaction> txs;
    private List<TransactionSummary> txrefs;

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public BigDecimal getFinal_balance() {
        return final_balance;
    }

    public void setFinal_balance(BigDecimal final_balance) {
        this.final_balance = final_balance;
    }

    public BigDecimal getUnconfirmed_balance() {
        return unconfirmed_balance;
    }

    public void setUnconfirmed_balance(BigDecimal unconfirmed_balance) {
        this.unconfirmed_balance = unconfirmed_balance;
    }

    public Long getN_tx() {
        return n_tx;
    }

    public void setN_tx(Long n_tx) {
        this.n_tx = n_tx;
    }

    public Long getUnconfirmed_n_tx() {
        return unconfirmed_n_tx;
    }

    public void setUnconfirmed_n_tx(Long unconfirmed_n_tx) {
        this.unconfirmed_n_tx = unconfirmed_n_tx;
    }

    public List<Transaction> getTxs() {
        return txs;
    }

    public void setTxs(List<Transaction> txs) {
        this.txs = txs;
    }

    public String getTx_url() {
        return tx_url;
    }

    public void setTx_url(String tx_url) {
        this.tx_url = tx_url;
    }

    public List<TransactionSummary> getTxrefs() {
        return txrefs;
    }

    public void setTxrefs(List<TransactionSummary> txrefs) {
        this.txrefs = txrefs;
    }

    @Override
    public String toString() {
        return "BCYAddress{" +
            "address='" + address + '\'' +
            ", balance=" + balance +
            ", final_balance=" + final_balance +
            ", unconfirmed_balance=" + unconfirmed_balance +
            ", n_tx=" + n_tx +
            ", unconfirmed_n_tx=" + unconfirmed_n_tx +
            ", tx_url='" + tx_url + '\'' +
            ", txs=" + txs +
            ", txrefs=" + txrefs +
            '}';
    }

}
