package com.biglabs.solo.ropsten;

import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.biglabs.solo.blockcypher.model.TokenInfo;
import com.biglabs.solo.blockcypher.model.blockchain.EthBlockchain;
import com.biglabs.solo.blockcypher.model.transaction.Transaction;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.EthIntermediaryTx;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.IntermediaryTransaction;
import com.biglabs.solo.config.ApplicationProperties;
import com.biglabs.solo.eth.Erc20Contract;
import com.biglabs.solo.eth.EthHelpers;
import com.biglabs.solo.web.rest.errors.InternalServerErrorException;
import com.biglabs.solo.web.rest.errors.JsonRpcException;
import com.biglabs.solo.web.rest.vm.EthTransactionRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestOperations;
import org.web3j.crypto.*;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.methods.response.*;
import org.web3j.utils.Numeric;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.MessageFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 * Created by antt on 7/3/2018.
 */
@Service
public class ETHRopstenClient  {
    private static final String BLOCKCHAIN_NAME = "ETH.ropsten";
    private static final Logger logger = LoggerFactory.getLogger(ETHRopstenClient.class);
    //    private final BlockCypherProperties blockCypherProperties;
    private final RestOperations restTemplate;
    private final Web3j web3j;
//    private final ApplicationProperties appProps;
    private final Map<String, Erc20Contract> address2Contracts;
//    private final ApplicationProperties.Ropsten ropsten;

    public ETHRopstenClient(RestOperations restTemplate,
                            Web3j web3j,
                            ApplicationProperties appProps,
                            @Qualifier("ropstenAddress2Contracts") Map<String, Erc20Contract> r) {
        this.restTemplate = restTemplate;
        this.web3j = web3j;
//        this.appProps = appProps;
        this.address2Contracts = r;
    }

    public BCYAddress balance(String address) {
        BCYAddress bcyAddress = new BCYAddress();
        try {
            EthGetBalance ethGetBalance = web3j.ethGetBalance(address, DefaultBlockParameter.valueOf("latest")).send();
            bcyAddress.setAddress(address);
            bcyAddress.setBalance(new BigDecimal(ethGetBalance.getBalance()));
            return bcyAddress;
        } catch (IOException e) {
            throw new InternalServerErrorException(e.getMessage());
        }
    }

    public EthBlockchain getBlockchain() {
        EthBlockchain blockchain = new EthBlockchain();
        blockchain.setName(BLOCKCHAIN_NAME);
        try {
            EthBlock block = web3j.ethGetBlockByNumber(DefaultBlockParameter.valueOf("latest"), false).send();
            blockchain.setHash(block.getBlock().getHash());
            blockchain.setHeight(block.getBlock().getNumber().longValue());
            Instant ist = Instant.ofEpochSecond(block.getBlock().getTimestamp().longValue());
            String stime = DateTimeFormatter.ISO_DATE_TIME.format(ist.atZone(ZoneId.of("UTC")));
            blockchain.setTime(stime);
            //TODO: high, medium, low price
            blockchain.setHighGasPrice(46086l);
            blockchain.setMediumGasPrice(29422l);
            blockchain.setLowGasPrice(12045l);
            return blockchain;
        } catch (IOException e) {
            throw new InternalServerErrorException(e.getMessage());
        }
    }

    public IntermediaryTransaction createTransaction(EthTransactionRequest txReq) throws Exception {
        String from = txReq.getInputs().get(0).getAddresses().get(0);
        String to = txReq.getOutputs().get(0).getAddresses().get(0);
        BigInteger value = txReq.getOutputs().get(0).getValue().toBigInteger();
        // get none
        BigInteger nonce = EthHelpers.getNonce(web3j, from);
        BigInteger gasPrice;
        BigInteger gasLimit;

        // dont use fees field
//        if (txReq.getFees() != null) {
//            // get gas-price
//            gasPrice = web3j.ethGasPrice().sendAsync().get().getGasPrice();
//            gasLimit = txReq.getFees().toBigInteger().divide(gasPrice).add(BigInteger.ONE);
//        }

        if (txReq.getGasLimit() != null){
            gasLimit = txReq.getGasLimit();
        } else {
            gasLimit = BigInteger.valueOf(21_000);
            logger.info("Use default gas limit {}", gasLimit);
        }

        if (txReq.getGasPrice() != null) {
            gasPrice = txReq.getGasPrice();
        } else {
            gasPrice = EthHelpers.retrieveGasPrice(web3j);
        }

        logger.info("nonce {}", nonce);
        logger.info("gas_price {}", gasPrice);
        logger.info("gas_limit {}", gasLimit);
        logger.info("fee {}", gasLimit.multiply(gasPrice));

        //TODO: validate transaction before send

        // create raw-tx
        RawTransaction rawtx = RawTransaction
            .createEtherTransaction(nonce, gasPrice, gasLimit, to, value );
        String tosign = EthHelpers.encodeRawTxToSign(rawtx);

        Transaction tx = new Transaction();
        tx.addInput(txReq.getInputs().get(0).toInput());
        tx.addOutput(txReq.getOutputs().get(0).toOutput());
        tx.setGasLimit(gasLimit);
        tx.setGasPrice(gasPrice);
        tx.setFees(new BigDecimal(gasLimit.multiply(gasPrice)));
        // set nonce, gasprice, gaslimit
        EthIntermediaryTx itx = new EthIntermediaryTx();
        itx.setNonce(nonce);
        itx.setTx(tx);
        itx.setTosign(Arrays.asList(tosign));
        //TODO: consider to save raw tx to db
        return itx;
    }

    public IntermediaryTransaction sendSignedTransaction(EthIntermediaryTx txReq) throws ExecutionException, InterruptedException {
        RawTransaction rtx = EthHelpers.rawEthTxFrom(txReq);
        byte[] signedTx = EthHelpers.signedTx(rtx, txReq);
        EthSendTransaction sendtx = web3j.ethSendRawTransaction(Numeric.toHexString(signedTx)).sendAsync().get();
        if (sendtx.getError() != null) {
            logger.warn("ERROR: {}, code {}", sendtx.getError().getMessage(), sendtx.getError().getCode());
            throw new JsonRpcException("Fail to send transaction", sendtx.getError());
        }
        txReq.getTx().setHash(sendtx.getTransactionHash());
        return txReq;
    }

    public TokenInfo tokenBalance(String contractAddress, String address) throws Exception {
        logger.info("[{}] Balance of {}", contractAddress, address);
        TokenInfo tokenInfo = new TokenInfo();
        Erc20Contract contract = address2Contracts.get(contractAddress.toLowerCase());
        if (contract == null) {
            throw new InternalServerErrorException(MessageFormat.format("Cannot find contract of token {0}", contractAddress));
        }

        BigInteger result = contract.balanceOf(address).send();
//
//        if (response.hasError()) {
//            String msg = MessageFormat.format("{0}: Cannot get balance of address {1}", contractAddress.toUpperCase(), address);
//            throw new JsonRpcException(msg, response.getError());
//        }
//        Uint256 b = (Uint256) types.get(0).getValue();
        tokenInfo.setAddress(address);
        tokenInfo.setBalance(new BigDecimal(result));
        tokenInfo.setSymbol(contractAddress);
        tokenInfo.setDecimals(contract.getDecimals());
        tokenInfo.setContractAddress(contract.getContractAddress());
        return tokenInfo;
    }

    public EthIntermediaryTx prepareTransfer(String contractAddress, EthTransactionRequest txRequest) throws Exception {
        Erc20Contract contract = address2Contracts.get(contractAddress.toLowerCase());
        if (contract == null) {
            throw new InternalServerErrorException(MessageFormat.format("Cannot find contract of token {0}", contractAddress));
        }
        String from = txRequest.getInputs().get(0).getAddresses().get(0);
        String to = txRequest.getOutputs().get(0).getAddresses().get(0);
        BigDecimal value = txRequest.getOutputs().get(0).getValue();

        return contract.prepareTransfer(contractAddress, txRequest.getGasLimit(), txRequest.getGasPrice(), from, to, value.toBigInteger());
    }

    public RemoteCall<EthSendTransaction> transfer(EthIntermediaryTx txReq) {
        Erc20Contract contract = address2Contracts.get(txReq.getContractAddress().toLowerCase());
        if (contract == null) {
            throw new InternalServerErrorException(MessageFormat.format("Cannot find contract of token {0}", txReq.getContractAddress()));
        }
        return contract.transfer(txReq);
    }

    public Erc20Contract tokenInfo(String contractAddress) {
        return address2Contracts.get(contractAddress);
    }

    public List<Erc20Contract> tokens() {
        return new ArrayList<>(address2Contracts.values());
    }
}
