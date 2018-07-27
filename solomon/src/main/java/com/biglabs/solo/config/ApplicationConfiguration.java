package com.biglabs.solo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

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

    @Bean
    public Web3j web3j() {
        logger.debug("Client URL {}", appProps.web3j.infuraRopstenUrl);
        return Web3j.build(new HttpService(appProps.web3j.infuraRopstenUrl));
    }
}
