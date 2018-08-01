package com.biglabs.solo.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A WalletAddress.
 */
@Entity
@Table(name = "wallet_address")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class WalletAddress implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "in_use")
    private Boolean inUse;

    @OneToOne
    @JoinColumn(unique = true)
    private Address address;

    @ManyToOne(optional = false)
    @NotNull
    private Wallet wallet;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isInUse() {
        return inUse;
    }

    public WalletAddress inUse(Boolean inUse) {
        this.inUse = inUse;
        return this;
    }

    public void setInUse(Boolean inUse) {
        this.inUse = inUse;
    }

    public Address getAddress() {
        return address;
    }

    public WalletAddress address(Address address) {
        this.address = address;
        return this;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public WalletAddress wallet(Wallet wallet) {
        this.wallet = wallet;
        return this;
    }

    public Boolean getInUse() {
        return inUse;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
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
        WalletAddress walletAddress = (WalletAddress) o;
        if (walletAddress.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), walletAddress.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "WalletAddress{" +
            "id=" + getId() +
            ", inUse='" + isInUse() + "'" +
            "}";
    }
}
