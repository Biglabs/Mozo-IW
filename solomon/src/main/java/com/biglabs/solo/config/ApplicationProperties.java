package com.biglabs.solo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Properties specific to Solomon.
 * <p>
 * Properties are configured in the application.yml file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {
    public final Web3jConfig web3j = new Web3jConfig();
    public final Ropsten ropsten = new Ropsten();
    public final Etherscan etherscan = new Etherscan();
    public Web3jConfig getWeb3j() {
        return web3j;
    }

    public Ropsten getRopsten() {
        return ropsten;
    }

    public Etherscan getEtherscan() {
        return etherscan;
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

    public static class Ropsten {
        Map<String, String> contractAddresses;

        public Map<String, String> getContractAddresses() {
            return contractAddresses;
        }

        public void setContractAddresses(Map<String, String> contractAddresses) {
            this.contractAddresses = contractAddresses;
        }
    }

    public static class Etherscan {
        private List<String> apiKeys;
        private String ropstenURL;
        private String mainnetURL;

        public List<String> getApiKeys() {
            return apiKeys;
        }

        public void setApiKeys(List<String> apiKeys) {
            this.apiKeys = apiKeys;
        }

        public String getRopstenURL() {
            return ropstenURL;
        }

        public void setRopstenURL(String ropstenURL) {
            this.ropstenURL = ropstenURL;
        }

        public String getMainnetURL() {
            return mainnetURL;
        }

        public void setMainnetURL(String mainnetURL) {
            this.mainnetURL = mainnetURL;
        }
    }
}
