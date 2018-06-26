package com.biglabs.solo.web.rest.vm;

import com.biglabs.solo.domain.Address;

import javax.validation.constraints.NotNull;

/**
 * Created by antt on 6/21/2018.
 */
public class WalletAddressVM extends Address {
    @NotNull
    private String walletId;

    public String getWalletId() {
        return walletId;
    }

    public void setWalletId(String walletId) {
        this.walletId = walletId;
    }
}
