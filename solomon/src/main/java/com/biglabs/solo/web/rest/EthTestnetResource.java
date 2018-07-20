package com.biglabs.solo.web.rest;

import com.biglabs.solo.blockcypher.ETHTestnetClient;
import com.biglabs.solo.blockcypher.exception.BlockCypherException;
import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.biglabs.solo.blockcypher.model.blockchain.EthBlockchain;
import com.biglabs.solo.blockcypher.model.transaction.FaucetReq;
import com.biglabs.solo.blockcypher.model.transaction.TxHistory;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.IntermediaryTransaction;
import com.biglabs.solo.domain.WalletAddress;
import com.biglabs.solo.repository.WalletAddressRepository;
import com.biglabs.solo.web.rest.errors.BadRequestAlertException;
import com.biglabs.solo.web.rest.vm.TransactionRequest;
import com.codahale.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * BitcoinResource controller
 */
@RestController
@RequestMapping("/api/eth/test")
public class EthTestnetResource {

    private final Logger log = LoggerFactory.getLogger(EthTestnetResource.class);
    private final ETHTestnetClient ethClient;
    private final WalletAddressRepository waRepo;

    public EthTestnetResource(ETHTestnetClient ethTestnetClient, WalletAddressRepository waRepo) {
        this.ethClient = ethTestnetClient;
        this.waRepo = waRepo;
    }

//    /**
//    * GET getAddressDetails
//    */
//    @GetMapping("/addrs/{addresses}/latest")
//    public BCYAddress[] getAddressDetail(@PathVariable String addresses) throws BlockCypherException {
//        String[] parsedAddress = addresses.split(";");
//        return ethClient.getLatestTx4MultiAddress(parsedAddress);
////        return "getAddressDetails";
//    }

    /**
    * GET getBalance
    */
    @GetMapping("/addrs/{address}/balance")
    public BCYAddress getBalance(@PathVariable String address) throws BlockCypherException {
        return ethClient.balance(address);
    }

    @PostMapping("/faucet")
    @Timed
    public ResponseEntity<Map> faucet(@Valid @RequestBody FaucetReq faucetReq) throws BlockCypherException {
        Map<String, String> tx = ethClient.faucet(faucetReq);
        return ResponseEntity.ok()
            .body(tx);
    }

    /**
     * GET  /addrs/{address}/txhistory : get all the transaction history of an address.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of transaction history in body
     */
    @GetMapping("/addrs/{address}/txhistory")
    @Timed
    public List<TxHistory> getTxHistory(@PathVariable String address,
                                        @RequestParam(value = "beforeHeight", required = false) BigDecimal beforeHeight) throws BlockCypherException {
        log.debug("REST request to get transaction history of an address");
        Optional<WalletAddress> wa = waRepo.findFirstByAddress_Address(address);
        if (!wa.isPresent()) {
            throw new BadRequestAlertException("Address does not link to any wallet", "WalletAddress", "addressnotlinked");
        }
        List<WalletAddress> was = waRepo.findWalletAddressByWallet_WalletId(wa.get().getWallet().getWalletId());
        List<String> adrs = was.stream().map(e -> e.getAddress().getAddress()).collect(Collectors.toList());
        return ethClient.getAddressTxHistory(address, adrs, beforeHeight);
    }

    @PostMapping("/txs")
    @Timed
    public ResponseEntity<IntermediaryTransaction> createTransaction(@Valid @RequestBody TransactionRequest txReq) throws BlockCypherException, URISyntaxException {
        IntermediaryTransaction tx = ethClient.createTransaction(txReq);
        return ResponseEntity.created(new URI("/api/btc/test/txs/" + tx.getTx().getHash()))
            .body(tx);
    }

    @PostMapping("/txs/send-signed-tx")
    @Timed
    public ResponseEntity<IntermediaryTransaction> sendSignedTransaction(@Valid @RequestBody IntermediaryTransaction txReq) throws BlockCypherException, URISyntaxException {
        IntermediaryTransaction tx = ethClient.sendSignedTransaction(txReq);
        return ResponseEntity.created(new URI("/api/btc/test/txs/" + tx.getTx().getHash()))
            .body(tx);
    }

    @GetMapping("/")
    @Timed
    public EthBlockchain getBlockchainInfo() throws BlockCypherException {
        return ethClient.getBlockchain();
    }
}
