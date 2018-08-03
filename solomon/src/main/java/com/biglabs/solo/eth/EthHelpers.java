package com.biglabs.solo.eth;

import com.biglabs.solo.blockcypher.model.transaction.intermediary.EthIntermediaryTx;
import com.biglabs.solo.domain.Wallet;
import com.biglabs.solo.ropsten.ETHRopstenClient;
import com.biglabs.solo.web.rest.errors.JsonRpcException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.web3j.crypto.*;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.rlp.RlpString;
import org.web3j.rlp.RlpType;
import org.web3j.utils.Bytes;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Wallet.
 */
public class EthHelpers {
    private static final Logger logger = LoggerFactory.getLogger(EthHelpers.class);
    public static final BigInteger ONE_GWEI = BigInteger.valueOf(1000000000);

    public static String encodeRawTxToSign(RawTransaction rawtx) {
        byte[] encodeRawTx = TransactionEncoder.encode(rawtx);
        return Numeric.toHexString(Hash.sha3(encodeRawTx));
    }

    public static List<RlpType> asRlpValues(
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

    public static Sign.SignatureData toSignatureData(String toSign, String sig, BigInteger publicKey) {
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

    public static RawTransaction rawTxFrom(EthIntermediaryTx txReq) {
        String to = txReq.getTx().getOutputs().get(0).getAddresses().get(0);
        BigInteger value = txReq.getTx().getOutputs().get(0).getValue().toBigInteger();
        return RawTransaction.createEtherTransaction(
            txReq.getNonce(), txReq.getTx().getGasPrice(), txReq.getTx().getGasLimit(), to, value);
    }

    public static BigInteger getNonce(Web3j web3j, String address) throws Exception {
        EthGetTransactionCount ethGetTransactionCount = web3j.ethGetTransactionCount(
            address, DefaultBlockParameterName.LATEST).sendAsync().get();
        if (ethGetTransactionCount.hasError()) {
            throw new JsonRpcException("Cannot get nonce of address", ethGetTransactionCount.getError());
        }
        return ethGetTransactionCount.getTransactionCount();
    }

    private static Sign.SignatureData signMessage(byte[] tosign, BigInteger publicKey, ECDSASignature sig) {

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
}
