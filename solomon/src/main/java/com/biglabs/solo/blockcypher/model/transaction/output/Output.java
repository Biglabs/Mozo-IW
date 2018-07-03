package com.biglabs.solo.blockcypher.model.transaction.output;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Output of a transaction, ie:
 * {
 * "value": 100000000,
 * "script": "76a914a4e9eecbbfd050cb2d47eb0452a97ccb607f53c788ac",
 * "spent_by": "",
 * "addresses": [
 * "mvYwMT3aZ5jNcRNNjv7ckxjbqMDtvQbAHz"
 * ],
 * "script_type": "pay-to-pubkey-hash"
 * }
 * @author <a href="mailto:seb.auvray@gmail.com">Sebastien Auvray</a>
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Output {

    private BigDecimal value;
    private String script;
    @JsonProperty(value = "spent_by")
    private String spentBy;
    private List<String> addresses = new ArrayList<String>();
    @JsonProperty(value = "script_type")
    private String scriptType;
    @JsonProperty(value = "data_hex")
    private String dataHex;
    @JsonProperty(value = "data_string")
    private String dataString;

    public Output() {
    }

    public String getScript() {
        return script;
    }

    public void setScript(String script) {
        this.script = script;
    }

    public String getSpentBy() {
        return spentBy;
    }

    public void setSpentBy(String spentBy) {
        this.spentBy = spentBy;
    }

    public void setAddresses(List<String> addresses) {
        this.addresses = addresses;
    }

    public String getScriptType() {
        return scriptType;
    }

    public void setDataHex(String dataHex) {
        this.dataHex = dataHex;
    }

    public void setDataString(String dataString) {
        this.dataString = dataString;
    }

    public boolean addAddress(String address) {
        return addresses.add(address);
    }

    public void setScriptType(String scriptType) {
        this.scriptType = scriptType;
    }

    public List<String> getAddresses() {
        return addresses;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public String getDataHex() {
        return dataHex;
    }

    public String getDataString() {
        return dataHex;
    }

    @Override
    public String toString() {
        return "Output{" +
            "value=" + value +
            ", script='" + script + '\'' +
            ", spentBy='" + spentBy + '\'' +
            ", addresses=" + addresses +
            ", scriptType='" + scriptType + '\'' +
            ", dataHex='" + dataHex + '\'' +
            ", dataString='" + dataString + '\'' +
            '}';
    }
}
