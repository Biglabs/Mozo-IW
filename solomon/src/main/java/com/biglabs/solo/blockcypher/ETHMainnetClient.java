package com.biglabs.solo.blockcypher;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestOperations;

/**
 * Created by antt on 7/3/2018.
 */
@Service
public class ETHMainnetClient extends  ETHClient {
    private final BlockCypherProperties blockCypherProperties;
    private final RestOperations restTemplate;

    public ETHMainnetClient(BlockCypherProperties bcyProps, RestOperations restTemplate) {
        super(new BCYContext(bcyProps.getVersion(), bcyProps.getEthMain(), bcyProps.token), restTemplate);
        this.blockCypherProperties = bcyProps;
        this.restTemplate = restTemplate;
    }

}
