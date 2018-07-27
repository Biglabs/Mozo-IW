package com.biglabs.solo.ropsten;

import com.biglabs.solo.blockcypher.model.BCYAddress;
import com.biglabs.solo.blockcypher.model.blockchain.EthBlockchain;
import com.biglabs.solo.blockcypher.model.transaction.Transaction;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.EthIntermediaryTx;
import com.biglabs.solo.blockcypher.model.transaction.intermediary.IntermediaryTransaction;
import com.biglabs.solo.web.rest.errors.InternalServerErrorException;
import com.biglabs.solo.web.rest.vm.EthTransactionRequest;
import com.biglabs.solo.web.rest.vm.TransactionRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestOperations;
import org.web3j.crypto.*;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthBlock;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.rlp.RlpEncoder;
import org.web3j.rlp.RlpList;
import org.web3j.rlp.RlpString;
import org.web3j.rlp.RlpType;
import org.web3j.utils.Bytes;
import org.web3j.utils.Numeric;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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
    public ETHRopstenClient(RestOperations restTemplate, Web3j web3j) {
        this.restTemplate = restTemplate;
        this.web3j = web3j;
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
        Transaction tx = new Transaction();
        EthIntermediaryTx itx = new EthIntermediaryTx();

        String from = txReq.getInputs().get(0).getAddresses().get(0);
        String to = txReq.getOutputs().get(0).getAddresses().get(0);
        BigInteger value = txReq.getOutputs().get(0).getValue().toBigInteger();
        // get none
        BigInteger nonce = getNonce(from);
        BigInteger gasPrice;
        BigInteger gasLimit;
        if (txReq.getFees() != null) {
            // get gas-price
            gasPrice = web3j.ethGasPrice().sendAsync().get().getGasPrice();
            gasLimit = txReq.getFees().toBigInteger().divide(gasPrice).add(BigInteger.ONE);
        } else {
            gasPrice = txReq.getGasPrice();
            gasLimit = txReq.getGasLimit();
        }

        // create raw-tx
        RawTransaction rawtx = RawTransaction
            .createEtherTransaction(nonce, gasPrice, gasLimit, to, value );
        byte[] encodeRawTx = TransactionEncoder.encode(rawtx);
        String tosign = Numeric.toHexString(Hash.sha3(encodeRawTx));

        tx.addInput(txReq.getInputs().get(0).toInput());
        tx.addOutput(txReq.getOutputs().get(0).toOutput());
        // set nonce, gasprice, gaslimit
        itx.setNonce(nonce);
        itx.setGasLimit(gasLimit);
        itx.setGasPrice(gasPrice);
        itx.setTx(tx);
        itx.setTosign(Arrays.asList(tosign));
        //TODO: consider to save raw tx to db
        return itx;
    }

    public IntermediaryTransaction sendSignedTransaction(EthIntermediaryTx txReq) throws ExecutionException, InterruptedException {
        String to = txReq.getTx().getOutputs().get(0).getAddresses().get(0);
        BigInteger value = txReq.getTx().getOutputs().get(0).getValue().toBigInteger();
        RawTransaction rtx = RawTransaction.createEtherTransaction(
            txReq.getNonce(), txReq.getGasPrice(), txReq.getGasLimit(), to, value);

        String sig = txReq.getSignatures().get(0);
        String toSign = txReq.getTosign().get(0);
        String publicKey = txReq.getPubkeys().get(0);
        BigInteger publicKeyBI = new BigInteger(Numeric.hexStringToByteArray(publicKey));
        // Make signature

        Sign.SignatureData sigData = makeSignature(toSign, sig, publicKeyBI);

        List<RlpType> values = asRlpValues(rtx, sigData);
        RlpList rlpList = new RlpList(values);
        byte[] signedTx = RlpEncoder.encode(rlpList);

        EthSendTransaction sendtx = web3j.ethSendRawTransaction(Numeric.toHexString(signedTx)).sendAsync().get();

        txReq.getTx().setHash(sendtx.getTransactionHash());
        return txReq;
    }

    private Sign.SignatureData makeSignature(String toSign, String sig, BigInteger publicKey) {
        byte[] sigBytes = Numeric.hexStringToByteArray(sig);
        int len = sigBytes.length;
        int rlen = sigBytes[3];
        int sIndex = 6 + rlen;
        int sLen = sigBytes[5 + rlen];
        byte[] r = new byte[rlen];
        byte[] s = new byte[sLen];
        System.arraycopy(sigBytes, 4, r, 0, rlen);
        System.arraycopy(sigBytes, sIndex, s, 0, sLen);
        logger.debug("Signature {}", sig);
        logger.debug("R         {}", Numeric.toHexString(r));
        logger.debug("S         {}", Numeric.toHexString(s));
        return signMessage(Numeric.hexStringToByteArray(toSign),
                        publicKey,
                        new ECDSASignature(new BigInteger(r), new BigInteger(s)));
    }


    public static Sign.SignatureData signMessage(byte[] tosign, BigInteger publicKey, ECDSASignature sig) {

        // Now we have to work backwards to figure out the recId needed to recover the signature.
        int recId = -1;
        for (int i = 0; i < 4; i++) {
            BigInteger k = Sign.recoverFromSignature(i, sig, tosign);
            if (k != null && k.equals(publicKey)) {
                recId = i;
                break;
            }
        }
        if (recId == -1) {
            throw new RuntimeException(
                "Could not construct a recoverable key. This should never happen.");
        }

        int headerByte = recId + 27;

        // 1 header + 32 bytes for R + 32 bytes for S
        byte v = (byte) headerByte;
        byte[] r = Numeric.toBytesPadded(sig.r, 32);
        byte[] s = Numeric.toBytesPadded(sig.s, 32);

        return new Sign.SignatureData(v, r, s);
    }

    BigInteger getNonce(String address) throws Exception {
        EthGetTransactionCount ethGetTransactionCount = web3j.ethGetTransactionCount(
            address, DefaultBlockParameterName.LATEST).sendAsync().get();

        return ethGetTransactionCount.getTransactionCount();
    }

    static List<RlpType> asRlpValues(
        RawTransaction rawTransaction, Sign.SignatureData signatureData) {
        List<RlpType> result = new ArrayList<>();

        result.add(RlpString.create(rawTransaction.getNonce()));
        result.add(RlpString.create(rawTransaction.getGasPrice()));
        result.add(RlpString.create(rawTransaction.getGasLimit()));

        // an empty to address (contract creation) should not be encoded as a numeric 0 value
        String to = rawTransaction.getTo();
        if (to != null && to.length() > 0) {
            // addresses that start with zeros should be encoded with the zeros included, not
            // as numeric values
            result.add(RlpString.create(Numeric.hexStringToByteArray(to)));
        } else {
            result.add(RlpString.create(""));
        }

        result.add(RlpString.create(rawTransaction.getValue()));

        // value field will already be hex encoded, so we need to convert into binary first
        byte[] data = Numeric.hexStringToByteArray(rawTransaction.getData());
        result.add(RlpString.create(data));

        if (signatureData != null) {
            result.add(RlpString.create(signatureData.getV()));
            result.add(RlpString.create(Bytes.trimLeadingZeroes(signatureData.getR())));
            result.add(RlpString.create(Bytes.trimLeadingZeroes(signatureData.getS())));
        }

        return result;
    }

}
