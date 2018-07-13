package com.biglabs.solo.web.rest.vm;

import com.biglabs.solo.domain.Address;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * Created by antt on 6/21/2018.
 */
public class WalletAddressVM {
    @Valid
    @NotEmpty
    private List<Address> addresses;
    @NotNull
    private String walletId;

    public String getWalletId() {
        return walletId;
    }

    public void setWalletId(String walletId) {
        this.walletId = walletId;
    }


    @Override
    public String toString() {
        return "WalletAddressVM{" +
            "addresses=" + addresses +
            ", walletId='" + walletId + '\'' +
            '}';
    }

    public List<Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }
}
