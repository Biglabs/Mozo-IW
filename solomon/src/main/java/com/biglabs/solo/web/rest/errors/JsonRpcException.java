package com.biglabs.solo.web.rest.errors;

import com.biglabs.solo.blockcypher.model.BlockCypherError;
import org.springframework.web.client.HttpStatusCodeException;
import org.web3j.protocol.core.Response;

/**
 * BlockCypherException
 * @author <a href="mailto:seb.auvray@gmail.com">Sebastien Auvray</a>
 */
public class JsonRpcException extends RuntimeException{

//    private int status;
    private Response.Error rpcError;

//    public HttpStatusCodeException getInternalException() {
//        return internalException;
//    }
//
//    public void setInternalException(HttpStatusCodeException internalException) {
//        this.internalException = internalException;
//    }

    public void setRpcError(Response.Error rpcError) {
        this.rpcError = rpcError;
    }

    private HttpStatusCodeException internalException;

    public JsonRpcException(String message, Response.Error rpcError) {
        super(message);
//        this.status = status;
        this.rpcError = rpcError;
    }

//    public JsonRpcException(HttpStatusCodeException ex, String message, Response.Error rpcError) {
//        super(message);
////        this.status = status;
//        this.rpcError = rpcError;
//        this.internalException = ex;
//    }

//    public JsonRpcException(HttpStatusCodeException internalException) {
//        this.internalException = internalException;
//    }

    public Response.Error getRpcError() {
        return rpcError;
    }

//    public int getStatus() {
//        return status;
//    }

    @Override
    public String toString() {
        return "BlockCypherException{" +
            "message=" + getMessage() +
//            ", status=" + status +
            ", rpcError=" + (rpcError != null ? rpcError.getCode() + "-" + rpcError.getMessage() : "") +
            ", internalException=" + internalException +
            '}';
    }

}
