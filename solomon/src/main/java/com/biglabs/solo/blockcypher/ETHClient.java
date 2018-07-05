package com.biglabs.solo.blockcypher;

import com.biglabs.solo.blockcypher.exception.BlockCypherException;
import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.biglabs.solo.blockcypher.model.BlockCypherError;
import com.biglabs.solo.blockcypher.model.Error;
import com.biglabs.solo.blockcypher.model.transaction.Transaction;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.IntermediaryTransaction;
import com.biglabs.solo.domain.enumeration.Network;
import com.biglabs.solo.web.rest.vm.TransactionRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.*;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

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
            return res.getBody();
        } catch (HttpStatusCodeException ex) {
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }
    }

    public IntermediaryTransaction sendSignedTransaction(IntermediaryTransaction signedTx) throws BlockCypherException {
        String url = MessageFormat.format(transactionEP + "/send?token={0}", "618c6ab8511347f78f97f3d687c86b22");
        System.out.println("Create new tx to:  " + url);
        try {
            ResponseEntity<IntermediaryTransaction> res = restTemplate.postForEntity(url, signedTx, IntermediaryTransaction.class);
            return res.getBody();
        } catch (HttpStatusCodeException ex) {
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }
    }

    public static BlockCypherException getBlockCypherException(HttpStatusCodeException ex, String errMessage, HttpStatus status, String body) {
        ObjectMapper om = new ObjectMapper();//.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            System.out.println("========= Body ");
            System.out.println(body);
            System.out.println("========= Body ");
            BlockCypherError error = om.readValue(body, BlockCypherError.class);
            if(error == null || error.getErrors().isEmpty()) {
                Error er = om.readValue(body, Error.class);
                error.addError(er);
            }
            System.out.println("=== BlockCypherError");
            System.out.println(error);
            return new BlockCypherException(ex, errMessage, status.value(), error);
        } catch (IOException e) {
            return new BlockCypherException(ex, errMessage + " - " + e.getMessage() , status.value(), null);
        }
    }
}
