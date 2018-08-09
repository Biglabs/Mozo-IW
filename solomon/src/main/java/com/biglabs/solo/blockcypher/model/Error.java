package com.biglabs.solo.blockcypher.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Error String
 * @author <a href="mailto:seb.auvray@gmail.com">Sebastien Auvray</a>
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Error {

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    private String error;

    public Error() {
    }

    public Error(String msg) {
        this.error = msg;
    }

    @Override
    public String toString() {
        return "Error{" +
                "error='" + error + '\'' +
                '}';
    }

}
