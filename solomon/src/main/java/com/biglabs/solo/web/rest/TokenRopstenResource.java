package com.biglabs.solo.web.rest;

import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.EthIntermediaryTx;
import com.biglabs.solo.eth.Erc20Contract;
import com.biglabs.solo.eth.EthTxHistory;
import com.biglabs.solo.eth.EtherscanRopsten;
import com.biglabs.solo.repository.WalletAddressRepository;
import com.biglabs.solo.ropsten.ETHRopstenClient;
import com.biglabs.solo.web.rest.errors.BadRequestAlertException;
import com.biglabs.solo.web.rest.vm.TokenTransactionRequest;
import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Strings;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.methods.response.EthSendTransaction;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.net.URI;
import java.util.List;
import java.util.Optional;

/**
 * BitcoinResource controller
 */
@RestController
@RequestMapping("/api/contract/ropsten")
public class TokenRopstenResource {

    private final Logger log = LoggerFactory.getLogger(TokenRopstenResource.class);
    private final ETHRopstenClient ethClient;
    private final WalletAddressRepository waRepo;
    private final EtherscanRopsten etherscanRopsten;
    private final int ETH_HEX_ADDRESS_LEN = 40;

    public TokenRopstenResource(ETHRopstenClient ethTestnetClient, WalletAddressRepository waRepo, EtherscanRopsten etherscanRopsten) {
        this.ethClient = ethTestnetClient;
        this.waRepo = waRepo;
        this.etherscanRopsten = etherscanRopsten;
    }

    /**
     * GET getBalance
     */
    @GetMapping("")
    @Timed
    public ResponseEntity<List<Erc20Contract>> getAll() throws Exception {
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(ethClient.tokens()));
    }

    /**
     * GET getBalance
     */
    @GetMapping("/{contractAddress}")
    @Timed
    public ResponseEntity<Erc20Contract> contractInfo(
        @PathVariable String contractAddress) throws Exception {
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(
            ethClient.tokenInfo(contractAddress)));
    }

    /**
    * GET getBalance
    */
    @GetMapping("/{contractAddress}/balance/{address}")
    @Timed
    public BCYAddress getBalance(@PathVariable String contractAddress,
                                 @PathVariable String address) throws Exception {

        return ethClient.tokenBalance(contractAddress, address);
    }

    /**
     * GET  /{contractAddress}/txhistory : get all the transaction history of an address.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of transaction history in body
     */
    @GetMapping("/{contractAddress}/txhistory")
    @Timed
    public List<EthTxHistory> getTxHistory(@PathVariable String contractAddress,
                                           @RequestParam(value = "beforeHeight", required = false) BigDecimal beforeHeight)  {
        return etherscanRopsten.getTokenTxs(contractAddress, beforeHeight);
    }

    /**
     * GET  /{contractAddress}/txhistory/{address} : get all the transaction history of an address.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of transaction history in body
     */
    @GetMapping("/{contractAddress}/txhistory/{address}")
    @Timed
    public List<EthTxHistory> getTxHistoryByAddress(
            @PathVariable String contractAddress,
            @PathVariable  String address,
            @RequestParam(value = "beforeHeight", required = false) BigDecimal beforeHeight)  {
        return etherscanRopsten.getTokenTxsByAddress(contractAddress, address, beforeHeight);
    }

    @PostMapping("/{contractAddress}/transfer")
    @Timed
    public ResponseEntity<EthIntermediaryTx> createTransaction(
        @PathVariable String contractAddress,
        @Valid @RequestBody TokenTransactionRequest txReq) throws Exception {

        EthIntermediaryTx tx = ethClient.prepareTransfer(contractAddress, txReq);
        return ResponseEntity.ok().body(tx);
    }

    @PostMapping("/{contractAddress}/send-transfer-tx")
    @Timed
    public ResponseEntity<EthIntermediaryTx> sendTransferTx(
            @PathVariable String contractAddress,
            @Valid @RequestBody EthIntermediaryTx txReq) throws Exception {
        validateTokenTx(txReq);
        RemoteCall<EthSendTransaction> ethRespon = ethClient.transfer(contractAddress, txReq);
        txReq.getTx().setHash(ethRespon.send().getTransactionHash());
        return ResponseEntity.created(new URI("/api/btc/test/txs/" + txReq.getTx().getHash()))
            .body(txReq);
    }


    private void validateTokenTx(EthIntermediaryTx txReq) {
        if (null == txReq.getTx()) {
            throw new BadRequestAlertException("Transaction object should not be null or empty", "transaction", "badrequest");
        }

        String data  = txReq.getTx().getData();
        if (Strings.isNullOrEmpty(data) || data.equalsIgnoreCase("0x")) {
            throw new BadRequestAlertException("Transaction data field should not be null or empty", "transaction", "badrequest");
        }
    }
}
