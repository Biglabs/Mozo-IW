package com.biglabs.solo.web.rest;

import com.biglabs.solo.blockcypher.BTCMainnetClient;
import com.biglabs.solo.blockcypher.BTCTestnetClient;
import com.biglabs.solo.blockcypher.exception.BlockCypherException;
import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.biglabs.solo.blockcypher.model.transaction.Transaction;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.IntermediaryTransaction;
import com.biglabs.solo.web.rest.vm.TransactionRequest;
import com.codahale.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

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
    public BCYAddress[] getAddressDetail(@PathVariable String addresses) throws BlockCypherException {
        String[] parsedAddress = addresses.split(";");
        return btcClient.getLatestTx4MultiAddress(parsedAddress);
//        return "getAddressDetails";
    }

    /**
    * GET getBalance
    */
    @GetMapping("/addrs/{address}/balance")
    public BCYAddress getBalance(@PathVariable String address) throws BlockCypherException {
        return btcClient.balance(address);
    }

    @PostMapping("/txs")
    @Timed
    public ResponseEntity<IntermediaryTransaction> createTransaction(@Valid @RequestBody TransactionRequest txReq) throws BlockCypherException, URISyntaxException {
        IntermediaryTransaction tx = btcClient.createTransaction(txReq);
        return ResponseEntity.created(new URI("/api/btc/test/txs/" + tx.getTx().getHash()))
            .body(tx);
    }

    @PostMapping("/txs/send-signed-tx")
    @Timed
    public ResponseEntity<IntermediaryTransaction> sendSignedTransaction(@Valid @RequestBody IntermediaryTransaction txReq) throws BlockCypherException, URISyntaxException {
        IntermediaryTransaction tx = btcClient.sendSignedTransaction(txReq);
        return ResponseEntity.created(new URI("/api/btc/test/txs/" + tx.getTx().getHash()))
            .body(tx);
    }

}
