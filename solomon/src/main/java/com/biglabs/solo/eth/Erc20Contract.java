package com.biglabs.solo.eth;


import com.biglabs.solo.blockcypher.model.transaction.intermediary.EthIntermediaryTx;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.IntermediaryTransaction;
import com.biglabs.solo.web.rest.errors.JsonRpcException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.generated.Uint8;
import org.web3j.crypto.RawTransaction;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.tx.exceptions.ContractCallException;

import java.io.IOException;
import java.math.BigInteger;
import java.rmi.Remote;
import java.util.Arrays;
import java.util.List;

public class Erc20Contract {
    private static final Logger logger = LoggerFactory.getLogger(Erc20Contract.class);

    public static final String FUNC_DECIMALS = "decimals";

    public static final String FUNC_SYMBOL = "symbol";
    public static final String FUNC_BALANCEOF = "balanceOf";
    public static final String FUNC_TOTALSUPPLY = "totalSupply";
    public static final String FUNC_TRANSFERFROM = "transferFrom";

    public final Web3j web3j;

    private final String contractAddress;
    private String symbol;
    private BigInteger decimals;
    private BigInteger totalSupply;

    public Erc20Contract(Web3j web3j, String address) {
        this.web3j = web3j;
        this.contractAddress = address;
    }

    public boolean init() {
        // get symbol and decimals
        try {
            logger.info("# Init contract at address {}", this.contractAddress);
            this.symbol = symbol().send();
            logger.info("#   symbol:\t{}", symbol);
            this.decimals = decimals().send();
            logger.info("#   decimal:\t{}", decimals);
            totalSupply = totalSupply().send();
            logger.info("#   totalSupply:\t{}", totalSupply);
            return true;
        } catch (Exception e) {
            logger.error("Failed to init contract at address {}: {}", contractAddress, e.getMessage());
            return false;
        }
    }

    public String getContractAddress() {
        return contractAddress;
    }

    public String getSymbol() {
        return symbol;
    }

    public BigInteger getDecimals() {
        return decimals;
    }

    public BigInteger getTotalSupply() {
        return totalSupply;
    }

    public RemoteCall<String> symbol() {
        Function f = new Function(
            FUNC_SYMBOL,
            Arrays.asList(),
            Arrays.asList(new TypeReference<Utf8String>(){}));
//        String ef = FunctionEncoder.encode(f);

        return executeRemoteSingleValueReturn(Address.DEFAULT.toString(), f, String.class);
    }

    public RemoteCall<BigInteger> decimals() {
        Function f = new Function(
            FUNC_DECIMALS,
            Arrays.asList(),
            Arrays.asList(new TypeReference<Uint8>(){}));
        return executeRemoteSingleValueReturn(Address.DEFAULT.toString(), f, BigInteger.class);
    }

    public RemoteCall<BigInteger> balanceOf(String address) {
        Function function = new Function (
            FUNC_BALANCEOF,
            Arrays.asList(new org.web3j.abi.datatypes.Address(address)),
            Arrays.asList(new TypeReference<Uint256>() {}));

        return executeRemoteSingleValueReturn(address, function, BigInteger.class);
    }

    public RemoteCall<BigInteger> totalSupply() {
        final Function function = new Function(FUNC_TOTALSUPPLY,
            Arrays.<Type>asList(),
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteSingleValueReturn(Address.DEFAULT.toString(), function, BigInteger.class);
    }

    public EthIntermediaryTx prepareTransfer(String from, String to, BigInteger value) {
        return null;
    }

    private <T> RemoteCall<T> executeRemoteSingleValueReturn(String fromAddress, Function f, Class<T> returnType) {
        return new RemoteCall<>(() -> executeCallSingleValueReturn(fromAddress, f, returnType));
    }

    private <T> T executeCallSingleValueReturn(String fromAddress, Function f, Class<T> returnClazz) throws IOException {
        String ef = FunctionEncoder.encode(f);
        EthCall ethCall = web3j.ethCall(
            Transaction.createEthCallTransaction(
                fromAddress,
                contractAddress,
                ef ),
            DefaultBlockParameterName.LATEST).send();

        if (ethCall.hasError()) {
            logger.error("FAILED executeCallSingleValueReturn(): {}", ethCall.getError().getMessage());
            throw new JsonRpcException("Remote execute failed", ethCall.getError());
        }
        List<Type> types = FunctionReturnDecoder.decode(ethCall.getValue(), f.getOutputParameters());
        if (types.size() == 0) {
            throw new RuntimeException("Remote call " + f.getName() + " return no value");
        }
        Type t = types.get(0);
        Object result = t.getValue();
        if (returnClazz.isAssignableFrom(result.getClass())) {
            return  (T) result;
        } else {
            throw new ContractCallException(
                "Unable to convert response: " + result
                    + " to expected type: " + returnClazz.getSimpleName());
        }
    }

}
