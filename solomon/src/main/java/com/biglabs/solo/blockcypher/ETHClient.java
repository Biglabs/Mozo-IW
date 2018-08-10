package com.biglabs.solo.blockcypher;

import com.biglabs.solo.blockcypher.exception.BlockCypherException;
import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.biglabs.solo.blockcypher.model.BlockCypherError;
import com.biglabs.solo.blockcypher.model.Error;
import com.biglabs.solo.blockcypher.model.blockchain.BtcBlockchain;
import com.biglabs.solo.blockcypher.model.blockchain.EthBlockchain;
import com.biglabs.solo.blockcypher.model.transaction.TX_ACTION;
import com.biglabs.solo.blockcypher.model.transaction.Transaction;
import com.biglabs.solo.blockcypher.model.transaction.TxHistory;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.IntermediaryTransaction;
import com.biglabs.solo.blockcypher.model.transaction.summary.TransactionSummary;
import com.biglabs.solo.domain.enumeration.Network;
import com.biglabs.solo.web.rest.errors.InternalServerErrorException;
import com.biglabs.solo.web.rest.vm.TransactionRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.MessageFormat;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static  com.biglabs.solo.blockcypher.BlockCypherProperties.*;

/**
 * Created by antt on 6/28/2018.
 */
public class ETHClient {
    private static final Logger logger = LoggerFactory.getLogger(ETHClient.class);
    protected final String rootEP;
    protected final String addressEP;
    protected final String transactionEP ;
    protected final BCYContext bycContext;
    protected final RestOperations restTemplate;

    public ETHClient(BCYContext bcyContext, RestOperations restOperations) {
        this.bycContext = bcyContext;
        this.restTemplate = restOperations;
        this.rootEP = MessageFormat.format(bcyContext.BLOCK_CYPHER_ENDPOINT + "/{0}/{1}/{2}",
            bycContext.getVersion(),
            bycContext.getCoininfo().getCoin(),
            bycContext.getCoininfo().getNetwork());
        this.addressEP = MessageFormat.format(bcyContext.BLOCK_CYPHER_ENDPOINT + "/{0}/{1}/{2}/addrs",
            bycContext.getVersion(),
            bycContext.getCoininfo().getCoin(),
            bycContext.getCoininfo().getNetwork());

        this.transactionEP = MessageFormat.format(bcyContext.BLOCK_CYPHER_ENDPOINT + "/{0}/{1}/{2}/txs",
            bycContext.getVersion(),
            bycContext.getCoininfo().getCoin(),
            bycContext.getCoininfo().getNetwork());
    }

    public BCYAddress balance(String address) throws BlockCypherException {
        String url = MessageFormat.format(addressEP + "/{0}/balance", address);
        System.out.println("Get balance " + url);
        try {
            BCYAddress ret = restTemplate.getForObject(url, BCYAddress.class);
            return ret;
        } catch (HttpStatusCodeException ex) {
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }
    }

    public BCYAddress[] getLatestTx4MultiAddress(String[] addresses) throws BlockCypherException {
        if (addresses.length == 1) {
            return new BCYAddress[]{getAddressLatestTx(addresses[0])};
        }

        String url = MessageFormat.format(addressEP + "/{0}/full", String.join(";", addresses));
        logger.info("API url {}", url);
        try {
            ResponseEntity<BCYAddress[]> ret = restTemplate.getForEntity(url,
                BCYAddress[].class,
                new HashMap<String, Object>() {{
                    put("limit", 1);
                    put("txlimit", 1);
                }});
            return ret.getBody();
        } catch (HttpStatusCodeException ex) {
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }
    }

    public BCYAddress getAddressLatestTx(String addresses) throws BlockCypherException {
        String url = MessageFormat.format(addressEP + "/{0}", String.join(";", addresses));
        logger.info("API url {}", url);
        try {
            ResponseEntity<BCYAddress> ret = restTemplate.getForEntity(url,
                BCYAddress.class,
                new HashMap<String, Object>() {{
                    put("limit", 1);
                    put("txlimit", 1);
                }});
            return ret.getBody();
        } catch (HttpStatusCodeException ex) {
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }
    }

    public Transaction pushRawTransaction(String rawTx) throws BlockCypherException {
        String url = MessageFormat.format(transactionEP + "/push?token={0}", bycContext.getToken());
        System.out.println("Push raw tx to:  " + url);
        try {
            Map<String, String> rr = new HashMap<>();
            rr.put("tx", rawTx);
            ResponseEntity<Transaction> res = restTemplate.postForEntity(url, rr, Transaction.class);
            return res.getBody();
        } catch (HttpStatusCodeException ex) {
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }
    }

    public IntermediaryTransaction createTransaction(TransactionRequest transactionRequest) throws BlockCypherException {
        String url = MessageFormat.format(transactionEP + "/new?token={0}", bycContext.getToken());
        System.out.println("Create new tx to:  " + url);
        try {
            ResponseEntity<IntermediaryTransaction> res = restTemplate.postForEntity(url, transactionRequest, IntermediaryTransaction.class);
            logger.debug("SUCCESS create tx: {}", res.getBody());
            return res.getBody();
        } catch (HttpStatusCodeException ex) {
            logger.error("Cannot create tx for request {}", transactionRequest);
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }
    }

    public IntermediaryTransaction sendSignedTransaction(IntermediaryTransaction signedTx) throws BlockCypherException {
        String url = MessageFormat.format(transactionEP + "/send?token={0}", bycContext.getToken());
        System.out.println("Create new tx to:  " + url);
        try {
            ResponseEntity<IntermediaryTransaction> res = restTemplate.postForEntity(url, signedTx, IntermediaryTransaction.class);
            return res.getBody();
        } catch (HttpStatusCodeException ex) {
            logger.error("Cannot send signed tx for {}", signedTx);
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }
    }

    public EthBlockchain getBlockchain() throws BlockCypherException {
        String url = rootEP;
        logger.debug("Get blockchain {}", url);
        try {
            ResponseEntity<EthBlockchain> res = restTemplate.getForEntity(url, EthBlockchain.class);
            return res.getBody();
        } catch (HttpStatusCodeException ex) {
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }

    }


    /***
     * Create transaction history from source address and transaction
     * Action field is:
     * - SENT: if src address not in the inputs
     * - RECEIVED: if action is not SENT
     * AddressTo is the first address in outputs excluding the {@code srcAddr}
     * @param srcAddr
     * @param tx
     * @param siblingAddrs
     * @return
     */
    private TxHistory fromTx(String srcAddr, TransactionSummary tx, List<String> siblingAddrs) {
        TxHistory txHistory = new TxHistory();
        txHistory.txHash = tx.getTxHash();
        txHistory.blockHeight = tx.getBlockHeight();
        txHistory.fees = null;
        txHistory.amount = tx.getValue();
        txHistory.confirmations = tx.getConfirmations();
        if (tx.getTxInputN() >= 0) {
            txHistory.action = TX_ACTION.SENT;
            txHistory.addressTo = null;
        } else {
            txHistory.action = TX_ACTION.RECEIVED;
        }

        //TODO: time is the confirmation time not the tx submitted time
        txHistory.time = Instant.parse(tx.getConfirmed()).getEpochSecond();
        txHistory.message = "";
        return txHistory;
    }

    public List<TxHistory> getAddressTxHistory(String addresses, List<String> siblingAddrs, BigDecimal beforeHeight) throws BlockCypherException {
        String url = MessageFormat.format(addressEP + "/{0}", String.join(";", addresses));
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url)
                .queryParam("limit", 20)
                .queryParam( "token", bycContext.getToken());
            if (beforeHeight != null) {
                builder.queryParam("before", beforeHeight);
            }
            ResponseEntity<BCYAddress> ret = restTemplate.getForEntity(builder.toUriString(), BCYAddress.class);
            BCYAddress bcyAddress = ret.getBody();
            if (bcyAddress == null || bcyAddress.getTxrefs() == null) {
                logger.info("No transaction found for address {} before height {}", addresses, beforeHeight);
                return Collections.emptyList();
            }
            logger.debug("Number of tx {}", bcyAddress.getTxrefs().size());
            return bcyAddress.getTxrefs().stream().map(tx -> fromTx(addresses, tx, siblingAddrs)).collect(Collectors.toList());
        } catch (HttpStatusCodeException ex) {
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }
    }

    public static BlockCypherException getBlockCypherException(HttpStatusCodeException ex, String errMessage, HttpStatus status, String body) {
        ObjectMapper om = new ObjectMapper();//.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            logger.info("========= Error Body <<<");
            logger.info(body);
            logger.info("========= Error Body >>>");
            BlockCypherError error = om.readValue(body, BlockCypherError.class);
            if(error == null || error.getErrors().isEmpty()) {
                logger.info("Cannot deserialize bcyerror. Try deserialize Error");
                Error er = om.readValue(body, Error.class);
                error.addError(er);
            }
            logger.info("==== deserialize bcyerror {}", error);
            return new BlockCypherException(ex, errMessage, status.value(), error);
        } catch (IOException e) {
            return new BlockCypherException(ex, errMessage + " - " + e.getMessage() , status.value(), null);
        }
    }
}
