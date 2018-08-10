package com.biglabs.solo.web.rest.errors;

import org.springframework.web.client.HttpStatusCodeException;
import org.web3j.protocol.core.Response;

/**
 * BlockCypherException
 * @author <a href="mailto:seb.auvray@gmail.com">Sebastien Auvray</a>
 */
public class NotFoundException extends RuntimeException{

    private long errorCode;

    public NotFoundException(String message, long code) {
        super(message);
        this.errorCode = code;
    }

    public long getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(long errorCode) {
        this.errorCode = errorCode;
    }
}
