package com.biglabs.solo.web.rest;

import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.EthIntermediaryTx;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.IntermediaryTransaction;
import com.biglabs.solo.eth.Erc20Contract;
import com.biglabs.solo.repository.WalletAddressRepository;
import com.biglabs.solo.ropsten.ETHRopstenClient;
import com.biglabs.solo.web.rest.errors.BadRequestAlertException;
import com.biglabs.solo.web.rest.vm.EthTransactionRequest;
import com.biglabs.solo.web.rest.vm.TokenTransactionRequest;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.methods.response.EthSendTransaction;

import javax.validation.Valid;
import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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
    @GetMapping("/")
    @Timed
    public ResponseEntity<List<Erc20Contract>> tokenInfo(
        @RequestParam(value = "contractAddress", required = false) String contractAddress) throws Exception {
//        if (!"MOZO".equalsIgnoreCase(symbol)) {
//            throw new BadRequestAlertException("Token not supported", "Token", "wrongToken");
//        }
        List<Erc20Contract> ret;
        if (contractAddress == null) {
            ret = ethClient.tokens();
        } else {
            ret = ethClient.tokenInfo(contractAddress) == null ? null : Arrays.asList(ethClient.tokenInfo(contractAddress));
        }
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(ret));
    }

    /**
    * GET getBalance
    */
    @GetMapping("/{address}/balance")
    @Timed
    public BCYAddress getBalance(@PathVariable String address,
                                 @RequestParam(value = "contractAddress") String contractAddress) throws Exception {
//        if (!"MOZO".equalsIgnoreCase(symbol)) {
//            throw new BadRequestAlertException("Token not supported", "Token", "wrongToken");
//        }
        return ethClient.tokenBalance(contractAddress, address);
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
    @PostMapping("/txs/transfer")
    @Timed
    public ResponseEntity<EthIntermediaryTx> createTransaction(@Valid @RequestBody TokenTransactionRequest txReq) throws Exception {
        if (!"MOZO".equalsIgnoreCase(txReq.getContractAddress())) {
            throw new BadRequestAlertException("Token not supported", "Token", "wrongToken");
        }
        EthIntermediaryTx tx = ethClient.prepareTransfer(txReq.getContractAddress(), txReq);
        return ResponseEntity.ok().body(tx);
    }

    @PostMapping("/txs/send-transfer-tx")
    @Timed
    public ResponseEntity<IntermediaryTransaction> sendTransferTx(@Valid @RequestBody EthIntermediaryTx txReq) throws Exception {
        RemoteCall<EthSendTransaction> ethRespon = ethClient.transfer(txReq);
        txReq.getTx().setHash(ethRespon.send().getTransactionHash());
        return ResponseEntity.created(new URI("/api/btc/test/txs/" + txReq.getTx().getHash()))
            .body(txReq);
    }

}
