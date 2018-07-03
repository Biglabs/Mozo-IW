package com.biglabs.solo.blockcypher.exception;

import com.biglabs.solo.blockcypher.model.BlockCypherError;
import org.springframework.web.client.HttpStatusCodeException;

/**
 * BlockCypherException
 * @author <a href="mailto:seb.auvray@gmail.com">Sebastien Auvray</a>
 */
public class BlockCypherException extends Exception {

    private int status;
    private BlockCypherError blockCypherError;

    public HttpStatusCodeException getInternalException() {
        return internalException;
    }

    public void setInternalException(HttpStatusCodeException internalException) {
        this.internalException = internalException;
    }

    public void setBlockCypherError(BlockCypherError blockCypherError) {
        this.blockCypherError = blockCypherError;
    }

    private HttpStatusCodeException internalException;

    public BlockCypherException(String message, int status, BlockCypherError blockCypherError) {
        super(message);
        this.status = status;
        this.blockCypherError = blockCypherError;
    }

    public BlockCypherException(HttpStatusCodeException ex, String message, int status, BlockCypherError blockCypherError) {
        super(message);
        this.status = status;
        this.blockCypherError = blockCypherError;
        this.internalException = ex;
    }

    public BlockCypherException(HttpStatusCodeException internalException) {
        this.internalException = internalException;
    }

    public BlockCypherError getBlockCypherError() {
        return blockCypherError;
    }

    public int getStatus() {
        return status;
    }

    @Override
    public String toString() {
        return "BlockCypherException{" +
            "message=" + getMessage() +
            ", status=" + status +
            ", blockCypherError=" + (blockCypherError != null ? blockCypherError.getErrors() : "") +
            ", internalException=" + internalException +
            '}';
    }

}
