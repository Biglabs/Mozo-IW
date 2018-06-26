package com.biglabs.solo.web.rest.vm;

import com.biglabs.solo.domain.Address;

import javax.validation.constraints.NotNull;

/**
 * Created by antt on 6/21/2018.
 */
public class WalletAddressVM {
    @NotNull
    private Address address;
    @NotNull
    private String walletId;

    public String getWalletId() {
        return walletId;
    }

    public void setWalletId(String walletId) {
        this.walletId = walletId;
    }

    public Address getAddress() {
        return address;
    }

    @Override
    public String toString() {
        return "WalletAddressVM{" +
            "address=" + address +
            ", walletId='" + walletId + '\'' +
            '}';
    }

    public void setAddress(Address address) {
        this.address = address;
    }
}
