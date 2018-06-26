package com.biglabs.solo.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import com.biglabs.solo.domain.enumeration.CoinType;

import com.biglabs.solo.domain.enumeration.Network;

/**
 * A Address.
 */
@Entity
@Table(name = "address")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Address implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "coin", nullable = false)
    private CoinType coin;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_network", nullable = false)
    private Network network;

    @NotNull
    @Column(name = "address", nullable = false)
    private String address;

    @NotNull
    @Column(name = "derived_index", nullable = false)
    private Integer derivedIndex;

    @Column(name = "balance", precision=10, scale=2)
    private BigDecimal balance;

    @Column(name = "unconfirmed_balance", precision=10, scale=2)
    private BigDecimal unconfirmedBalance;

    @Column(name = "final_balance", precision=10, scale=2)
    private BigDecimal finalBalance;

    @Column(name = "n_confirmed_tx")
    private Long nConfirmedTx;

    @Column(name = "n_unconfirmed_tx")
    private Long nUnconfirmedTx;

    @Column(name = "total_received")
    private Long totalReceived;

    @Column(name = "total_sent")
    private Long totalSent;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CoinType getCoin() {
        return coin;
    }

    public Address coin(CoinType coin) {
        this.coin = coin;
        return this;
    }

    public void setCoin(CoinType coin) {
        this.coin = coin;
    }

    public Network getNetwork() {
        return network;
    }

    public Address network(Network network) {
        this.network = network;
        return this;
    }

    public void setNetwork(Network network) {
        this.network = network;
    }

    public String getAddress() {
        return address;
    }

    public Address address(String address) {
        this.address = address;
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getDerivedIndex() {
        return derivedIndex;
    }

    public Address derivedIndex(Integer derivedIndex) {
        this.derivedIndex = derivedIndex;
        return this;
    }

    public void setDerivedIndex(Integer derivedIndex) {
        this.derivedIndex = derivedIndex;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public Address balance(BigDecimal balance) {
        this.balance = balance;
        return this;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public BigDecimal getUnconfirmedBalance() {
        return unconfirmedBalance;
    }

    public Address unconfirmedBalance(BigDecimal unconfirmedBalance) {
        this.unconfirmedBalance = unconfirmedBalance;
        return this;
    }

    public void setUnconfirmedBalance(BigDecimal unconfirmedBalance) {
        this.unconfirmedBalance = unconfirmedBalance;
    }

    public BigDecimal getFinalBalance() {
        return finalBalance;
    }

    public Address finalBalance(BigDecimal finalBalance) {
        this.finalBalance = finalBalance;
        return this;
    }

    public void setFinalBalance(BigDecimal finalBalance) {
        this.finalBalance = finalBalance;
    }

    public Long getnConfirmedTx() {
        return nConfirmedTx;
    }

    public Address nConfirmedTx(Long nConfirmedTx) {
        this.nConfirmedTx = nConfirmedTx;
        return this;
    }

    public void setnConfirmedTx(Long nConfirmedTx) {
        this.nConfirmedTx = nConfirmedTx;
    }

    public Long getnUnconfirmedTx() {
        return nUnconfirmedTx;
    }

    public Address nUnconfirmedTx(Long nUnconfirmedTx) {
        this.nUnconfirmedTx = nUnconfirmedTx;
        return this;
    }

    public void setnUnconfirmedTx(Long nUnconfirmedTx) {
        this.nUnconfirmedTx = nUnconfirmedTx;
    }

    public Long getTotalReceived() {
        return totalReceived;
    }

    public Address totalReceived(Long totalReceived) {
        this.totalReceived = totalReceived;
        return this;
    }

    public void setTotalReceived(Long totalReceived) {
        this.totalReceived = totalReceived;
    }

    public Long getTotalSent() {
        return totalSent;
    }

    public Address totalSent(Long totalSent) {
        this.totalSent = totalSent;
        return this;
    }

    public void setTotalSent(Long totalSent) {
        this.totalSent = totalSent;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Address address = (Address) o;
        if (address.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), address.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Address{" +
            "id=" + getId() +
            ", coin='" + getCoin() + "'" +
            ", network='" + getNetwork() + "'" +
            ", address='" + getAddress() + "'" +
            ", derivedIndex='" + getDerivedIndex() + "'" +
            ", balance='" + getBalance() + "'" +
            ", unconfirmedBalance='" + getUnconfirmedBalance() + "'" +
            ", finalBalance='" + getFinalBalance() + "'" +
            ", nConfirmedTx='" + getnConfirmedTx() + "'" +
            ", nUnconfirmedTx='" + getnUnconfirmedTx() + "'" +
            ", totalReceived='" + getTotalReceived() + "'" +
            ", totalSent='" + getTotalSent() + "'" +
            "}";
    }
}
