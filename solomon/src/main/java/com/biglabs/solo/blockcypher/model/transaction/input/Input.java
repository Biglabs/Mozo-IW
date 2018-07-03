package com.biglabs.solo.blockcypher.model.transaction.input;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Input of a transation, ie:
 *
 * {
 * "prev_hash": "c3fe841599794f88374b0aaf0cbd5b3897d75c4dc897a846e6040054d5495d66",
 * "output_index": 0,
 * "script": "483045022100ddb75ef19a31eb5e25595cb35c6b5f058912cc168a32a215c680a5532900904202200efb197876164fa246ff5009a04f39ff51db70adb90ee342f0aa97ec19d776eb012103f78041c92a4aea6e44ac937c8bd7e504e14768a40879dc7655e533a749fea55b",
 * "output_value": 499950000,
 * "addresses": [
 * "mqz1CxAGWahHuaTnjHFnitfv8VguUwe7dN"
 * ],
 * "script_type": "pay-to-pubkey-hash"
 * }
 * @author <a href="mailto:seb.auvray@gmail.com">Sebastien Auvray</a>
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Input {
    @JsonProperty(value = "prev_hash")
    private String prevHash;
    @JsonProperty(value = "output_index")
    private Long outputIndex;
    private String script;
    @JsonProperty(value = "output_value")
    private BigDecimal outputValue;
    private List<String> addresses = new ArrayList<String>();
    @JsonProperty(value = "script_type")
    private String scriptType;

    @Override
    public String toString() {
        return "Input{" +
            "prevHash='" + prevHash + '\'' +
            ", outputIndex=" + outputIndex +
            ", script='" + script + '\'' +
            ", outputValue=" + outputValue +
            ", addresses=" + addresses +
            ", scriptType='" + scriptType + '\'' +
            '}';
    }

    public Input() {
    }

    public boolean addAddress(String address) {
        return addresses.add(address);
    }

    public void setScriptType(String scriptType) {
        this.scriptType = scriptType;
    }

    public String getPrevHash() {
        return prevHash;
    }

    public void setPrevHash(String prevHash) {
        this.prevHash = prevHash;
    }

    public Long getOutputIndex() {
        return outputIndex;
    }

    public void setOutputIndex(Long outputIndex) {
        this.outputIndex = outputIndex;
    }

    public String getScript() {
        return script;
    }

    public void setScript(String script) {
        this.script = script;
    }

    public BigDecimal getOutputValue() {
        return outputValue;
    }

    public void setOutputValue(BigDecimal outputValue) {
        this.outputValue = outputValue;
    }

    public List<String> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<String> addresses) {
        this.addresses = addresses;
    }

    public String getScriptType() {
        return scriptType;
    }
}
