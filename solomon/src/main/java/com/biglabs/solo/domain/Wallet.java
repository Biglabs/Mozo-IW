package com.biglabs.solo.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Wallet.
 */
@Entity
@Table(name = "wallet")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Wallet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "wallet_key", nullable = false)
    private String walletKey;

    @Column(name = "wallet_id")
    private String walletId;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "wallet")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WalletAddress> addresses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWalletKey() {
        return walletKey;
    }

    public Wallet walletKey(String walletKey) {
        this.walletKey = walletKey;
        return this;
    }

    public void setWalletKey(String walletKey) {
        this.walletKey = walletKey;
    }

    public String getWalletId() {
        return walletId;
    }

    public Wallet walletId(String walletId) {
        this.walletId = walletId;
        return this;
    }

    public void setWalletId(String walletId) {
        this.walletId = walletId;
    }

    public String getName() {
        return name;
    }

    public Wallet name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<WalletAddress> getAddresses() {
        return addresses;
    }

    public Wallet addresses(Set<WalletAddress> walletAddresses) {
        this.addresses = walletAddresses;
        return this;
    }

    public Wallet addAddresses(WalletAddress walletAddress) {
        this.addresses.add(walletAddress);
        walletAddress.setWallet(this);
        return this;
    }

    public Wallet removeAddresses(WalletAddress walletAddress) {
        this.addresses.remove(walletAddress);
        walletAddress.setWallet(null);
        return this;
    }

    public void setAddresses(Set<WalletAddress> walletAddresses) {
        this.addresses = walletAddresses;
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
        Wallet wallet = (Wallet) o;
        if (wallet.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), wallet.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Wallet{" +
            "id=" + getId() +
            ", walletKey='" + getWalletKey() + "'" +
            ", walletId='" + getWalletId() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
