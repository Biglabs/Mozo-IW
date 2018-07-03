package com.biglabs.solo.web.rest;

import com.biglabs.solo.blockcypher.BTCMainnetClient;
import com.biglabs.solo.blockcypher.BTCTestnetClient;
import com.biglabs.solo.blockcypher.exception.BlockCypherException;
import com.biglabs.solo.blockcypher.model.BCYAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BitcoinResource controller
 */
@RestController
@RequestMapping("/api/btc/test")
public class BtcTestnetResource {

    private final Logger log = LoggerFactory.getLogger(BtcTestnetResource.class);
    private final BTCTestnetClient btcClient;

    public BtcTestnetResource(BTCTestnetClient btcClient) {
        this.btcClient = btcClient;
    }

    /**
    * GET getAddressDetails
    */
    @GetMapping("/addrs/{addresses}/latest")
    public BCYAddress[] getAddressDetail(String addresses) throws BlockCypherException {
        String[] parsedAddress = addresses.split(";");
        return btcClient.getLatestTx4MultiAddress(parsedAddress);
//        return "getAddressDetails";
    }

    /**
    * GET getBalance
    */
    @GetMapping("/addrs/{address}/balance")
    public BCYAddress getBalance(String address) throws BlockCypherException {
        return btcClient.balance(address);
    }

}
