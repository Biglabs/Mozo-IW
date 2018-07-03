package com.biglabs.solo.blockcypher;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Created by antt on 6/27/2018.
 */
@ConfigurationProperties(
    prefix = "blockcypher",
    ignoreUnknownFields = true
)
public class BlockCypherProperties {
    private String endpoint = "https://api.blockcypher.com";
    private String version = "v1";
    private EndPointConfig btcMain = new EndPointConfig();
    private EndPointConfig btcTest = new EndPointConfig();
    private EndPointConfig ethMain = new EndPointConfig();
    private EndPointConfig ethTest = new EndPointConfig();

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String token;

    @Override
    public String toString() {
        return "BlockCypherProperties{" +
            "endpoint='" + endpoint + '\'' +
            ", version='" + version + '\'' +
            ", btcMain=" + btcMain +
            ", btcTest=" + btcTest +
            ", ethMain=" + ethMain +
            ", ethTest=" + ethTest +
            ", token='" + token + '\'' +
            '}';
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public EndPointConfig getBtcMain() {
        return btcMain;
    }

    public EndPointConfig getBtcTest() {
        return btcTest;
    }

    public EndPointConfig getEthMain() {
        return ethMain;
    }

    public EndPointConfig getEthTest() {
        return ethTest;
    }

    public void setBtcMain(EndPointConfig btcMain) {
        this.btcMain = btcMain;
    }

    public void setBtcTest(EndPointConfig btcTest) {
        this.btcTest = btcTest;
    }

    public void setEthMain(EndPointConfig ethMain) {
        this.ethMain = ethMain;
    }

    public void setEthTest(EndPointConfig ethTest) {
        this.ethTest = ethTest;
    }

    public static class EndPointConfig {
        private String coin ;
        private String network ;

        public EndPointConfig() {
        }

        public String getCoin() {
            return coin;
        }

        public void setCoin(String coin) {
            this.coin = coin;
        }

        public String getNetwork() {
            return network;
        }

        public void setNetwork(String network) {
            this.network = network;
        }

        @Override
        public String toString() {
            return "EndPointConfig{" +
                "coin='" + coin + '\'' +
                ", network='" + network + '\'' +
                '}';
        }
    }

//    public class BtcTest {
//        private String coin = "";
//        private String network = "";
//
//        public String getCoin() {
//            return coin;
//        }
//
//        public void setCoin(String coin) {
//            this.coin = coin;
//        }
//
//        public String getNetwork() {
//            return network;
//        }
//
//        public void setNetwork(String network) {
//            this.network = network;
//        }
//
//    }
//
//    private class EthMain {
//        private String coin = "";
//        private String network = "";
//
//        public String getCoin() {
//            return coin;
//        }
//
//        public void setCoin(String coin) {
//            this.coin = coin;
//        }
//
//        public String getNetwork() {
//            return network;
//        }
//
//        public void setNetwork(String network) {
//            this.network = network;
//        }
//
//    }
//
//    private class EthTest {
//        private String coin = "";
//        private String network = "";
//
//        public String getCoin() {
//            return coin;
//        }
//
//        public void setCoin(String coin) {
//            this.coin = coin;
//        }
//
//        public String getNetwork() {
//            return network;
//        }
//
//        public void setNetwork(String network) {
//            this.network = network;
//        }
//
//    }
}
