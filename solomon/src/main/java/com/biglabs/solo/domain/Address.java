package com.biglabs.solo.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
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
            "}";
    }
}
