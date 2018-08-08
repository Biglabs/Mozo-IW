package com.biglabs.solo.config;

import com.biglabs.solo.eth.Erc20Contract;
import com.biglabs.solo.service.util.RoundrobinApiTokens;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by antt on 6/27/2018.
 */
@Configuration
public class ApplicationConfiguration {
    private static final Logger logger = LoggerFactory.getLogger(ApplicationConfiguration.class);

    private final ApplicationProperties appProps;

    public ApplicationConfiguration(ApplicationProperties appProps) {
        this.appProps = appProps;
    }
    private ExecutorService threadPool = Executors.newCachedThreadPool();
    @Bean
    public Web3j web3j() {
        logger.debug("Client URL {}", appProps.web3j.infuraRopstenUrl);
        logger.debug("Ropsten contract address {}", appProps.ropsten.contractAddresses);
        return Web3j.build(new HttpService(appProps.web3j.infuraRopstenUrl));
    }

    @Bean(value = "ropstenContracts")
    public Map<String, Erc20Contract> ropstenContracts() {
        Map<String, String> addresses = appProps.getRopsten().getContractAddresses();
        Map<String, Erc20Contract> ret = new ConcurrentHashMap<>();
        for(String token: addresses.keySet()) {
            logger.info("Creating contract: {}-{}", token, addresses.get(token));
            Erc20Contract c = new Erc20Contract(web3j(), addresses.get(token));
            threadPool.submit(() -> {
                if (c.init()) {
                    logger.info("SUCCEEDED creating contract: {}-{}", token, addresses.get(token));
                    ret.put(c.getSymbol().toLowerCase(), c);
                } else {
                    logger.info("FAILED creating contract: {}-{}", token, addresses.get(token));
                }
            });
        }
        return ret;
    }

    @Bean(value = "etherscanTokens")
    public RoundrobinApiTokens etherscanTokens() {
        List<String> tokens = this.appProps.getEtherscan().getApiKeys();
        logger.debug("etherscan tokens: {}", tokens);
        return new RoundrobinApiTokens(tokens, "etherscan");
    }
}
