package com.biglabs.solo.eth.etherscan;

import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

/**
 * Error String
 * @author <a href="mailto:seb.auvray@gmail.com">Sebastien Auvray</a>
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EscanResponse extends BCYAddress{
    private Integer status;
    private String message;
    private List<EscanTransaction> result;

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<EscanTransaction> getResult() {
        return result;
    }

    public void setResult(List<EscanTransaction> result) {
        this.result = result;
    }
}
