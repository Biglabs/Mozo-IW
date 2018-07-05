package com.biglabs.solo.web.rest;

import com.biglabs.solo.blockcypher.BTCTestnetClient;
import com.biglabs.solo.blockcypher.ETHTestnetClient;
import com.biglabs.solo.blockcypher.exception.BlockCypherException;
import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.biglabs.solo.blockcypher.model.transaction.FaucetReq;
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
import java.util.Map;

/**
 * BitcoinResource controller
 */
@RestController
@RequestMapping("/api/eth/test")
public class EthTestnetResource {

    private final Logger log = LoggerFactory.getLogger(EthTestnetResource.class);
    private final ETHTestnetClient ethTestnetClient;

    public EthTestnetResource(ETHTestnetClient ethTestnetClient) {
        this.ethTestnetClient = ethTestnetClient;
    }

    /**
    * GET getAddressDetails
    */
    @GetMapping("/addrs/{addresses}/latest")
    public BCYAddress[] getAddressDetail(@PathVariable String addresses) throws BlockCypherException {
        String[] parsedAddress = addresses.split(";");
        return ethTestnetClient.getLatestTx4MultiAddress(parsedAddress);
//        return "getAddressDetails";
    }

    /**
    * GET getBalance
    */
    @GetMapping("/addrs/{address}/balance")
    public BCYAddress getBalance(@PathVariable String address) throws BlockCypherException {
        return ethTestnetClient.balance(address);
    }

    @PostMapping("/faucet")
    @Timed
    public ResponseEntity<Map> faucet(@Valid @RequestBody FaucetReq faucetReq) throws BlockCypherException {
        Map<String, String> tx = ethTestnetClient.faucet(faucetReq);
        return ResponseEntity.ok()
            .body(tx);
    }

    @PostMapping("/txs")
    @Timed
    public ResponseEntity<IntermediaryTransaction> createTransaction(@Valid @RequestBody TransactionRequest txReq) throws BlockCypherException, URISyntaxException {
        IntermediaryTransaction tx = ethTestnetClient.createTransaction(txReq);
        return ResponseEntity.created(new URI("/api/btc/test/txs/" + tx.getTx().getHash()))
            .body(tx);
    }

    @PostMapping("/txs/send-signed-tx")
    @Timed
    public ResponseEntity<IntermediaryTransaction> sendSignedTransaction(@Valid @RequestBody IntermediaryTransaction txReq) throws BlockCypherException, URISyntaxException {
        IntermediaryTransaction tx = ethTestnetClient.sendSignedTransaction(txReq);
        return ResponseEntity.created(new URI("/api/btc/test/txs/" + tx.getTx().getHash()))
            .body(tx);
    }

}
