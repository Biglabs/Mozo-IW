package com.biglabs.solo.blockcypher;

import com.biglabs.solo.blockcypher.exception.BlockCypherException;
import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.biglabs.solo.blockcypher.model.BlockCypherError;
import com.biglabs.solo.blockcypher.model.Error;
import com.biglabs.solo.blockcypher.model.transaction.Transaction;
import com.biglabs.solo.domain.enumeration.Network;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestOperations;

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
    private final String addressEP;
    private final String transactionEP ;
    private final BCYContext bycContext;
    private final RestOperations restTemplate;

    public ETHClient(BCYContext bcyContext, RestOperations restOperations) {
        this.bycContext = bcyContext;
        this.restTemplate = restOperations;

        this.addressEP = MessageFormat.format(bcyContext.BLOCK_CYPHER_ENDPOINT + "/{0}/{1}/{2}/addrs",
            bycContext.getVersion(),
            bycContext.getCoininfo().getCoin(),
            bycContext.getCoininfo().getNetwork());

        this.transactionEP = MessageFormat.format(bcyContext.BLOCK_CYPHER_ENDPOINT + "/{0}/{1}/{2}/txs",
            bycContext.getVersion(),
            bycContext.getCoininfo().getCoin(),
            bycContext.getCoininfo().getNetwork());
    }

    public BCYAddress balance(String address) {
        String url = MessageFormat.format(addressEP + "/{0}/balance", address);
        System.out.println("Get balance " + url);
        try {
            BCYAddress ret = restTemplate.getForObject(url, BCYAddress.class);
            return ret;
        } catch (RestClientException ex) {
            throw ex;
        }
    }


    public Transaction createRawTransaction(String rawTx) throws BlockCypherException {
        String url = MessageFormat.format(transactionEP + "/push?token={0}", bycContext.getToken());
        System.out.println("Push raw tx to:  " + url);
        try {
//            MultiValueMap<String, Object> req = new LinkedMultiValueMap<>();
//            req.put("tx", Arrays.asList(rawTx));
            Map<String, String> rr = new HashMap<>();
            rr.put("tx", rawTx);
            ResponseEntity<Transaction> res = restTemplate.postForEntity(url, rr, Transaction.class);
            return res.getBody();
        }  catch (HttpClientErrorException ex) {
            System.out.println(ex.getResponseBodyAsString());
//            System.out.println(ex.getResponseHeaders().toString());
            throw getBlockCypherException(ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        } catch (HttpServerErrorException ex) {
//            System.out.println(ex.getResponseBodyAsString());
//            System.out.println(ex.getResponseHeaders().toString());
            throw getBlockCypherException(ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }
    }

    public static BlockCypherException getBlockCypherException(String errMessage, HttpStatus status, String body) {
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
            return new BlockCypherException(errMessage, status.value(), error);
        } catch (IOException e) {
            return new BlockCypherException(errMessage + " - " + e.getMessage() , status.value(), null);
        }
    }
}
