package com.biglabs.solo.web.rest.vm;

import com.biglabs.solo.domain.enumeration.Network;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.Valid;
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
    private Boolean inUsed;

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

    public Boolean getInUsed() {
        return inUsed;
    }

    public void setInUsed(Boolean inUsed) {
        this.inUsed = inUsed;
    }

    public static class AddressUpdate {

        @NotNull
        private Network network;

        @NotNull
        private String address;

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
    }
}
