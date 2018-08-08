package com.biglabs.solo.eth;

import com.biglabs.solo.blockcypher.model.transaction.TX_ACTION;
import com.biglabs.solo.blockcypher.model.transaction.TxHistory;
import com.biglabs.solo.config.ApplicationProperties;
import com.biglabs.solo.eth.etherscan.EscanResponse;
import com.biglabs.solo.eth.etherscan.EscanTransaction;
import com.biglabs.solo.ropsten.ETHRopstenClient;
import com.biglabs.solo.service.util.RoundrobinApiTokens;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestOperations;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Service Interface for managing Wallet.
 */
@Service
public class EtherscanRopsten {
    private static final Logger logger = LoggerFactory.getLogger(EtherscanRopsten.class);
    private final RoundrobinApiTokens tokens;
    private final ApplicationProperties appProps;
    private final String ropstenURL;
    private final RestOperations restTemplate;
    private final ETHRopstenClient ethClient;

    public EtherscanRopsten(
        @Qualifier("etherscanTokens") RoundrobinApiTokens tokens,
        ApplicationProperties appProps,
        RestOperations restTemplate,
        ETHRopstenClient ethRopstenClient) {
        this.tokens = tokens;
        this.appProps = appProps;
        this.restTemplate = restTemplate;
        this.ethClient = ethRopstenClient;
        this.ropstenURL = appProps.getEtherscan().getRopstenURL();
        logger.info("# Initialized EtherscanRopsten");
        logger.info("# \tropsten URL:  {}", ropstenURL);
        logger.info("# \ttokens     :  {}", tokens.toString());
    }

    public List<TxHistory> getNormalTxs(String address,  BigDecimal beforeHeight) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(ropstenURL)
            .queryParam("module", "account")
            .queryParam("action", "txlist")
            .queryParam("page", 1)
            .queryParam("offset", 20)
            .queryParam("sort", "desc")
            .queryParam("apiKey", tokens.getToken())
            .queryParam("address", address);

        if (beforeHeight != null) {
            builder.queryParam("endblock", beforeHeight.subtract(BigDecimal.ONE));
        }

        try {
            ResponseEntity<EscanResponse> ret = restTemplate.getForEntity(builder.toUriString(), EscanResponse.class);
            List<TxHistory> txHistories = new ArrayList<>();
            for (EscanTransaction e: ret.getBody().getResult()) {
                TxHistory txHistory = new TxHistory();
                txHistory.setAddressTo(e.getTo());
                txHistory.setAmount(e.getValue());
                txHistory.setBlockHeight(e.getBlockNumber());
                txHistory.setConfirmations(e.getConfirmations());
                BigDecimal fees = e.getGasPrice().multiply(e.getGasUsed());
                txHistory.setFees(fees);
                txHistory.setTime(e.getTimeStamp());
                txHistory.setTxHash(e.getHash());

                if (txHistory.getAddressTo().equalsIgnoreCase(address)) {
                    txHistory.setAction(TX_ACTION.RECEIVED);
                } else {
                    txHistory.setAction(TX_ACTION.SENT);
                }
                txHistories.add(txHistory);
            }
            return txHistories;
        } catch (HttpStatusCodeException ex) {
            throw ex;
        }
    }
}
