package com.biglabs.solo.blockcypher;

import com.biglabs.solo.blockcypher.exception.BlockCypherException;
import com.biglabs.solo.blockcypher.model.transaction.FaucetReq;
import com.biglabs.solo.blockcypher.model.transaction.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestOperations;

import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by antt on 7/3/2018.
 */
@Service
public class ETHTestnetClient extends  ETHClient {
    private static final Logger logger = LoggerFactory.getLogger(ETHTestnetClient.class);
    private final BlockCypherProperties blockCypherProperties;
    private final RestOperations restTemplate;

    public ETHTestnetClient(BlockCypherProperties bcyProps, RestOperations restTemplate) {
        super(new BCYContext(bcyProps.getVersion(), bcyProps.getEthTest(), bcyProps.token), restTemplate);
        this.blockCypherProperties = bcyProps;
        this.restTemplate = restTemplate;
    }

    public Map<String, String> faucet(FaucetReq req) throws BlockCypherException {
        String url = MessageFormat.format(rootEP + "/faucet?token={0}", bycContext.getToken());
        logger.info("API url: {}", url);
        try {
            Map<String, Object> rr = new HashMap<>();
            rr.put("address", req.address);
            rr.put("amount", req.amount);
            ResponseEntity<Map> res = restTemplate.postForEntity(url, rr, Map.class);
            return res.getBody();
        } catch (HttpStatusCodeException ex) {
            throw getBlockCypherException(ex, ex.getMessage(), ex.getStatusCode(), ex.getResponseBodyAsString());
        }
    }
}
