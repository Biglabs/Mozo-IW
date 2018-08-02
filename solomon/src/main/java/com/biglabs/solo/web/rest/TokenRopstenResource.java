package com.biglabs.solo.web.rest;

import com.biglabs.solo.blockcypher.exception.BlockCypherException;
import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.biglabs.solo.blockcypher.model.blockchain.EthBlockchain;
import com.biglabs.solo.blockcypher.model.transaction.TxHistory;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.EthIntermediaryTx;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.IntermediaryTransaction;
import com.biglabs.solo.repository.WalletAddressRepository;
import com.biglabs.solo.ropsten.ETHRopstenClient;
import com.biglabs.solo.web.rest.errors.BadRequestAlertException;
import com.biglabs.solo.web.rest.vm.EthTransactionRequest;
import com.codahale.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * BitcoinResource controller
 */
@RestController
@RequestMapping("/api/token/ropsten")
public class TokenRopstenResource {

    private final Logger log = LoggerFactory.getLogger(TokenRopstenResource.class);
    private final ETHRopstenClient ethClient;
    private final WalletAddressRepository waRepo;

    public TokenRopstenResource(ETHRopstenClient ethTestnetClient, WalletAddressRepository waRepo) {
        this.ethClient = ethTestnetClient;
        this.waRepo = waRepo;
    }

    /**
    * GET getBalance
    */
    @GetMapping("/{address}/balance")
    @Timed
    public BCYAddress getBalance(@PathVariable String address,
                                 @RequestParam(value = "symbol") String symbol) throws Exception {
        if (!"MOZO".equalsIgnoreCase(symbol)) {
            throw new BadRequestAlertException("Token not supported", "Token", "wrongToken");
        }
        return ethClient.tokenBalance(symbol, address);
    }
//
//    /**
//     * GET  /addrs/{address}/txhistory : get all the transaction history of an address.
//     *
//     * @return the ResponseEntity with status 200 (OK) and the list of transaction history in body
//     */
//    @GetMapping("/addrs/{address}/txhistory")
//    @Timed
//    public List<TxHistory> getTxHistory(@PathVariable String address,
//                                        @RequestParam(value = "beforeHeight", required = false) BigDecimal beforeHeight) throws BlockCypherException {
////        log.debug("REST request to get transaction history of an address");
////        Optional<WalletAddress> wa = waRepo.findFirstByAddress_Address(address);
////        if (!wa.isPresent()) {
////            throw new BadRequestAlertException("Address does not link to any wallet", "WalletAddress", "addressnotlinked");
////        }
////        List<WalletAddress> was = waRepo.findWalletAddressByWallet_WalletId(wa.get().getWallet().getWalletId());
////        List<String> adrs = was.stream().map(e -> e.getAddress().getAddress()).collect(Collectors.toList());
////        return ethClient.getAddressTxHistory(address, adrs, beforeHeight);
//        //TODO:
//        return Collections.emptyList();
//    }
//
//    @PostMapping("/txs")
//    @Timed
//    public ResponseEntity<IntermediaryTransaction> createTransaction(@Valid @RequestBody EthTransactionRequest txReq) throws Exception {
//        IntermediaryTransaction tx = ethClient.createTransaction(txReq);
//        return ResponseEntity.ok().body(tx);
//    }
//
//    @PostMapping("/txs/send-signed-tx")
//    @Timed
//    public ResponseEntity<IntermediaryTransaction> sendSignedTransaction(@Valid @RequestBody EthIntermediaryTx txReq) throws Exception {
//        IntermediaryTransaction tx = ethClient.sendSignedTransaction(txReq);
//        return ResponseEntity.created(new URI("/api/btc/test/txs/" + tx.getTx().getHash()))
//            .body(tx);
//    }

}
