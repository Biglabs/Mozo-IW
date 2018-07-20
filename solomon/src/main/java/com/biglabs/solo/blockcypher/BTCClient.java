package com.biglabs.solo.blockcypher;

import com.biglabs.solo.blockcypher.exception.BlockCypherException;
import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.biglabs.solo.blockcypher.model.BlockCypherError;
import com.biglabs.solo.blockcypher.model.Error;
import com.biglabs.solo.blockcypher.model.blockchain.BtcBlockchain;
import com.biglabs.solo.blockcypher.model.transaction.TX_ACTION;
import com.biglabs.solo.blockcypher.model.transaction.Transaction;
import com.biglabs.solo.blockcypher.model.transaction.TxHistory;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.IntermediaryTransaction;
import com.biglabs.solo.domain.Address;
import com.biglabs.solo.web.rest.errors.InternalServerErrorException;
import com.biglabs.solo.web.rest.vm.TransactionRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.*;
import org.springframework.web.util.UriComponentsBuilder;
//import org.springframework.http.client.support
import java.io.IOException;
import java.math.BigDecimal;
import java.text.MessageFormat;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by antt on 6/28/2018.
 */
public class BTCClient {
    private static final Logger logger = LoggerFactory.getLogger(BTCClient.class);
    protected final String rootEP;
    protected final String addressEP;
    protected final String transactionEP ;
    protected final BCYContext bycContext;
    protected final RestOperations restTemplate;

    public BTCClient(BCYContext bcyContext, RestOperations restOperations) {
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
        logger.debug("Get balance " + url);
        try {
            ResponseEntity<BCYAddress> ret = restTemplate.getForEntity(url, BCYAddress.class);
            return ret.getBody();
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
        String url = MessageFormat.format(addressEP + "/{0}/full", String.join(";", addresses));
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
    private TxHistory fromTx(String srcAddr, Transaction tx, List<String> siblingAddrs) {
        TxHistory txHistory = new TxHistory();
        txHistory.txHash = tx.getHash();
        txHistory.blockHeight = tx.getBlockHeight();
        txHistory.fees = tx.getFees();
        txHistory.confirmations = tx.getConfirmations();

        List<String> inputAddrs = tx.getInputs().stream()
            .flatMap(input -> input.getAddresses().stream())
            .collect(Collectors.toList());
        List<String> outputAddrs = tx.getOutputs().stream()
            .flatMap(output -> output.getAddresses().stream())
            .collect(Collectors.toList());
        if (inputAddrs.contains(srcAddr)) {
            txHistory.action  = TX_ACTION.SENT;
            List<String> filterAddr = outputAddrs.stream()
                                                .filter(s -> !s.equalsIgnoreCase(srcAddr))
                                                .collect(Collectors.toList());
            txHistory.addressTo = filterAddr.size() > 0 ? filterAddr.get(0) : "";
        } else {
            if (!outputAddrs.contains(srcAddr)) {
                String msg = String.format("Transaction %s do not contain address %s", tx.getHash(), srcAddr);
                throw new InternalServerErrorException(msg);
            }
            txHistory.action = TX_ACTION.RECEIVED;
        }

        calculateAmount(tx, siblingAddrs, txHistory);

        txHistory.time = Instant.parse(tx.getReceived()).getEpochSecond();
        txHistory.message = "";
        return txHistory;
    }

    //TODO: amount may be wrong if siblingAddrs is not up to date
    private void calculateAmount(Transaction tx, List<String> siblingAddrs, TxHistory txHistory) {
        switch (txHistory.action) {
            case SENT:
                txHistory.amount = tx.getOutputs().stream()
                    .filter(output -> !siblingAddrs.contains(output.getAddresses().get(0)))
                    .map(output -> output.getValue())
                    .reduce((output, output2) -> output.add(output2)).get();


                break;
            case RECEIVED:
                txHistory.amount = tx.getOutputs().stream()
                    .filter(output -> siblingAddrs.contains(output.getAddresses().get(0)))
                    .map(output -> output.getValue())
                    .reduce((output, output2) -> output.add(output2)).get();
                break;
            default:
                break;
        }
    }

    public List<TxHistory> getAddressTxHistory(String addresses, List<String> siblingAddrs, BigDecimal beforeHeight) throws BlockCypherException {
        String url = MessageFormat.format(addressEP + "/{0}/full", String.join(";", addresses));
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url)
                .queryParam("limit", 20)
                .queryParam( "token", bycContext.getToken());
            if (beforeHeight != null) {
                builder.queryParam("before", beforeHeight);
            }
            ResponseEntity<BCYAddress> ret = restTemplate.getForEntity(builder.toUriString(), BCYAddress.class);
            BCYAddress bcyAddress = ret.getBody();
            List<Transaction> txs = bcyAddress.getTxs();
            //antt: blockcypher always include unconfirmed txs in the results regardless of request params
            //      blockcypher is not to update with btc testnet
            //      use https://test-insight.bitpay.com/ to check different
            logger.debug("Number of tx {}", txs.size());
            return txs.stream()
                        .filter(transaction -> beforeHeight != null ? transaction.getBlockHeight() > 0 : true )
                        .map(tx -> fromTx(addresses, tx, siblingAddrs)).collect(Collectors.toList());
        } catch (HttpStatusCodeException ex) {
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }
    }

    public Transaction pushRawTransaction(String rawTx) throws BlockCypherException {
        String url = MessageFormat.format(transactionEP + "/push?token={0}", bycContext.getToken());
        logger.debug("Push raw tx to:  " + url);
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
        logger.info("Create new tx to:  " + url);
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
        String url = MessageFormat.format(transactionEP + "/send?token={0}", "618c6ab8511347f78f97f3d687c86b22");
        logger.debug("Create new tx to:  " + url);
        try {
            ResponseEntity<IntermediaryTransaction> res = restTemplate.postForEntity(url, signedTx, IntermediaryTransaction.class);
            return res.getBody();
        } catch (HttpStatusCodeException ex) {
            logger.error("Cannot send signed tx for {}", signedTx);
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }
    }

    public BtcBlockchain getBlockchain() throws BlockCypherException {
        String url = rootEP;
        logger.debug("Get blockchain {}", url);
        try {
            ResponseEntity<BtcBlockchain> res = restTemplate.getForEntity(url, BtcBlockchain.class);
            return res.getBody();
        } catch (HttpStatusCodeException ex) {
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }

    }

    public static BlockCypherException getBlockCypherException(HttpStatusCodeException ex, String errMessage, HttpStatus status, String body) {
        ObjectMapper om = new ObjectMapper();//.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            logger.debug("========= Body <<<");
            logger.debug(body);
            logger.debug("========= Body >>>");
            BlockCypherError error = om.readValue(body, BlockCypherError.class);
            if(error == null || error.getErrors().isEmpty()) {
                Error er = om.readValue(body, Error.class);
                error.addError(er);
            }
            logger.debug("=== BlockCypherError");
            logger.debug(error.toString());
            return new BlockCypherException(ex, errMessage, status.value(), error);
        } catch (IOException e) {
            return new BlockCypherException(ex, errMessage + " - " + e.getMessage() , status.value(), null);
        }
    }
}

