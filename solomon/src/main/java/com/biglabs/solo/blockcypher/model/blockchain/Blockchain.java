package com.biglabs.solo.blockcypher.model.blockchain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Representation of a BlockChain, ie:
 * {
 * "name": "BTC.main",
 * "height": 360060,
 * "hash": "000000000000000000bf56ff4a81e399374a68344a64d6681039412de78366b8",
 * "time": "2015-06-08T22:57:08.260165627Z",
 * "latest_url": "https://api.blockcypher.com/v1/btc/main/blocks/000000000000000000bf56ff4a81e399374a68344a64d6681039412de78366b8",
 * "previous_hash": "000000000000000011c9511ae1265d34d3c16fff6e8f94380425833b3d0ae5d8",
 * "previous_url": "https://api.blockcypher.com/v1/btc/main/blocks/000000000000000011c9511ae1265d34d3c16fff6e8f94380425833b3d0ae5d8",
 * "peer_count": 239,
 * "unconfirmed_count": 617,
 * "high_fee_per_kb": 46086,
 * "medium_fee_per_kb": 29422,
 * "low_fee_per_kb": 12045,
 * "last_fork_height": 359865,
 * "last_fork_hash": "00000000000000000aa6462fd9faf94712ce1b5a944dc666f491101c996beab9"
 * }
 *
 * @author <a href="mailto:seb.auvray@gmail.com">Sebastien Auvray</a>
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Blockchain {
    //The name of the blockchain represented, in the form of $COIN.$CHAIN.
    private String name;
    //The current height of the blockchain; i.e., the number of blocks in the blockchain.
    private Long height;
    //The hash of the latest confirmed block in the blockchain; in Bitcoin, the hashing function is SHA256(SHA256(block)).
    private String hash;
    //The time of the latest update to the blockchain; typically when the latest block was added.
    private String time;

    //The BlockCypher URL to query for more information on the latest confirmed block
    @JsonProperty(value = "latest_url")
    private String latestUrl;
    @JsonProperty(value = "previous_hash")
    private String prevHash;
    @JsonProperty(value = "previous_url")
    private String prevUrl;
    @JsonProperty(value = "unconfirmed_count")
    private String unconfirmedCount;

    @Override
    public String toString() {
        return "Blockchain{" +
            "name='" + name + '\'' +
            ", height=" + height +
            ", hash='" + hash + '\'' +
            ", time='" + time + '\'' +
            ", latestUrl='" + latestUrl + '\'' +
            ", prevHash='" + prevHash + '\'' +
            ", prevUrl='" + prevUrl + '\'' +
            ", unconfirmedCount='" + unconfirmedCount + '\'' +
            '}';
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getHeight() {
        return height;
    }

    public void setHeight(Long height) {
        this.height = height;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getLatestUrl() {
        return latestUrl;
    }

    public void setLatestUrl(String latestUrl) {
        this.latestUrl = latestUrl;
    }

    public String getPrevHash() {
        return prevHash;
    }

    public void setPrevHash(String prevHash) {
        this.prevHash = prevHash;
    }

    public String getPrevUrl() {
        return prevUrl;
    }

    public void setPrevUrl(String prevUrl) {
        this.prevUrl = prevUrl;
    }

    public String getUnconfirmedCount() {
        return unconfirmedCount;
    }

    public void setUnconfirmedCount(String unconfirmedCount) {
        this.unconfirmedCount = unconfirmedCount;
    }
}
