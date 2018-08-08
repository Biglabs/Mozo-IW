package com.biglabs.solo.web.rest.vm;

import com.biglabs.solo.domain.Address;
import com.biglabs.solo.domain.enumeration.CoinType;
import com.biglabs.solo.domain.enumeration.Network;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * Created by antt on 6/21/2018.
 */
public class WalletAddressUpdateVM {
    @Valid
    @NotNull
    private AddressUpdate address;
    @NotNull
    private String walletId;
    private Boolean inUse;

    public String getWalletId() {
        return walletId;
    }

    public void setWalletId(String walletId) {
        this.walletId = walletId;
    }


    @Override
    public String toString() {
        return "WalletAddressVM{" +
            "addresses=" + address +
            ", walletId='" + walletId + '\'' +
            '}';
    }

    public AddressUpdate getAddress() {
        return address;
    }

    public void setAddress(AddressUpdate address) {
        this.address = address;
    }

    public Boolean getInUse() {
        return inUse;
    }

    public void setInUse(Boolean inUse) {
        this.inUse = inUse;
    }

    public static class AddressUpdate {

        @NotNull
        private String address;

        @NotNull
        private Network network;

        private CoinType coin;

        @Min(value = 0, message = "Account index must be greater or equal 0")
        private Integer accountIndex;

        @Min(value = 0, message = "Chain index must be greater or equal 0")
        private Integer chainIndex;

        @Min(value = 0, message = "Address index must be greater or equal 0")
        private Integer addressIndex;

        public Network getNetwork() {
            return network;
        }

        public void setNetwork(Network network) {
            this.network = network;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public Integer getAccountIndex() {
            return accountIndex;
        }

        public void setAccountIndex(Integer accountIndex) {
            this.accountIndex = accountIndex;
        }

        public Integer getChainIndex() {
            return chainIndex;
        }

        public void setChainIndex(Integer chainIndex) {
            this.chainIndex = chainIndex;
        }

        public Integer getAddressIndex() {
            return addressIndex;
        }

        public void setAddressIndex(Integer addressIndex) {
            this.addressIndex = addressIndex;
        }

        public CoinType getCoin() {
            return coin;
        }

        public void setCoin(CoinType coin) {
            this.coin = coin;
        }

        public Address toNewAddress() {
            Address a = new Address();
            a.setAddress(this.address);
            a.setNetwork(this.getNetwork());
            a.setCoin(this.coin);
            a.setAccountIndex(this.accountIndex);
            a.setChainIndex(this.chainIndex);
            a.setAddressIndex(this.addressIndex);
            return a;
        }

        @Override
        public String toString() {
            return "AddressUpdate{" +
                "address='" + address + '\'' +
                ", network=" + network +
                '}';
        }
    }
}
