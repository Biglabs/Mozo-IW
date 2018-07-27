package com.biglabs.solo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Solomon.
 * <p>
 * Properties are configured in the application.yml file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {
    public final Web3jConfig web3j = new Web3jConfig();

    public Web3jConfig getWeb3j() {
        return web3j;
    }

    public static class Web3jConfig {
        public String getInfuraRopstenUrl() {
            return infuraRopstenUrl;
        }

        public void setInfuraRopstenUrl(String infuraRopstenUrl) {
            this.infuraRopstenUrl = infuraRopstenUrl;
        }

        public String infuraRopstenUrl;
    }
}
