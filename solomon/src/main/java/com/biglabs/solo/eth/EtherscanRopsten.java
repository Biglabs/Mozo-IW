package com.biglabs.solo.eth;

import com.biglabs.solo.config.ApplicationProperties;
import com.biglabs.solo.eth.etherscan.EscanResponse;
import com.biglabs.solo.eth.etherscan.EscanTransaction;
import com.biglabs.solo.ropsten.ETHRopstenClient;
import com.biglabs.solo.service.util.RoundrobinApiTokens;
import com.biglabs.solo.web.rest.errors.ErrorConstants;
import com.biglabs.solo.web.rest.errors.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestOperations;
import org.springframework.web.util.UriComponentsBuilder;
import org.web3j.abi.TypeDecoder;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.utils.Numeric;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.nio.charset.Charset;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Service Interface for managing Wallet.
 */
@Service
public class EtherscanRopsten {
    private static final Logger logger = LoggerFactory.getLogger(EtherscanRopsten.class);
    private final RoundrobinApiTokens tokens;
    private final ApplicationProperties appProps;
    private final String ropstenURL;
    private final RestOperations restTemplate;
    private final ETHRopstenClient ethClient;
    private final Map<String, Erc20Contract> address2Contracts;

    public EtherscanRopsten(
        @Qualifier("etherscanTokens") RoundrobinApiTokens tokens,
        ApplicationProperties appProps,
        RestOperations restTemplate,
        ETHRopstenClient ethRopstenClient,
        @Qualifier("ropstenAddress2Contracts") Map<String, Erc20Contract> address2Contracts) {
        this.tokens = tokens;
        this.appProps = appProps;
        this.restTemplate = restTemplate;
        this.ethClient = ethRopstenClient;
        this.address2Contracts = address2Contracts;
        this.ropstenURL = appProps.getEtherscan().getRopstenURL();
        logger.info("# Initialized EtherscanRopsten");
        logger.info("# \tropsten URL:  {}", ropstenURL);
        logger.info("# \ttokens     :  {}", tokens.toString());
    }

    public List<EthTxHistory> getTokenTxs(String contractAddress, BigDecimal beforeHeight) {
        if (!address2Contracts.containsKey(contractAddress)) {
            throw new NotFoundException(MessageFormat.format("Cannot find contract at address {0}", contractAddress),
                ErrorConstants.ErrorCode.CONTRACT_NOTFOUND);
        }

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(ropstenURL)
            .queryParam("module", "account")
            .queryParam("action", "tokentx")
            .queryParam("page", 1)
            .queryParam("offset", 20)
            .queryParam("sort", "desc")
            .queryParam("apiKey", tokens.getToken())
            .queryParam("contractaddress", contractAddress);

        if (beforeHeight != null) {
            builder.queryParam("endblock", beforeHeight.subtract(BigDecimal.ONE));
        }

        try {
            ResponseEntity<EscanResponse> ret = restTemplate.getForEntity(builder.toUriString(), EscanResponse.class);
            List<EthTxHistory> txHistories = new ArrayList<>();
            if (ret.getBody() == null) {
                return txHistories;
            }

            for (EscanTransaction e: ret.getBody().getResult()) {
                TokenTx t = decodeInput(e.getInput());
                EthTxHistory txHistory;
                // if input is not of type transfer or create considering
                // this is an ETH transaction
                if (t == null) {
                    logger.info("Unrecognized contract transaction type of tx {}", e.getHash());
                } else {
                    Erc20Contract contract = address2Contracts.get(contractAddress);
                    txHistory = transformTokenTx(e, t);
                    txHistories.add(txHistory);
                }
            }

            return txHistories;
        } catch (HttpStatusCodeException ex) {
            throw ex;
        }
    }

    public List<EthTxHistory> getTokenTxsByAddress(String contractAddress, String address, BigDecimal beforeHeight) {
        if (!address2Contracts.containsKey(contractAddress)) {
            throw new NotFoundException(MessageFormat.format("Cannot find contract at address {0}", contractAddress),
                ErrorConstants.ErrorCode.CONTRACT_NOTFOUND);
        }

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(ropstenURL)
            .queryParam("module", "account")
            .queryParam("action", "tokentx")
            .queryParam("page", 1)
            .queryParam("offset", 20)
            .queryParam("sort", "desc")
            .queryParam("apiKey", tokens.getToken())
            .queryParam("contractaddress", contractAddress)
            .queryParam("address", address);

        if (beforeHeight != null) {
            builder.queryParam("endblock", beforeHeight.subtract(BigDecimal.ONE));
        }

        try {
            ResponseEntity<EscanResponse> ret = restTemplate.getForEntity(builder.toUriString(), EscanResponse.class);
            List<EthTxHistory> txHistories = new ArrayList<>();
            if (ret.getBody() == null) {
                return txHistories;
            }

            for (EscanTransaction e: ret.getBody().getResult()) {
                TokenTx t = decodeInput(e.getInput());
                EthTxHistory txHistory;
                // if input is not of type transfer or create considering
                // this is an ETH transaction
                if (t == null) {
                    logger.info("Unrecognized contract transaction type of tx {}", e.getHash());
                } else {
                    Erc20Contract contract = address2Contracts.get(contractAddress);
                    txHistory = transformTokenTx(e, t);
                    txHistories.add(txHistory);
                }
            }

            return txHistories;
        } catch (HttpStatusCodeException ex) {
            throw ex;
        }
    }

    public List<EthTxHistory> getNormalTxs(String address,  BigDecimal beforeHeight) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(ropstenURL)
            .queryParam("module", "account")
            .queryParam("action", "txlist")
            .queryParam("page", 1)
            .queryParam("offset", 20)
            .queryParam("sort", "desc")
            .queryParam("apiKey", tokens.getToken())
            .queryParam("address", address);

        if (beforeHeight != null) {
            builder.queryParam("endblock", beforeHeight.subtract(BigDecimal.ONE));
        }

        try {
            ResponseEntity<EscanResponse> ret = restTemplate.getForEntity(builder.toUriString(), EscanResponse.class);
            List<EthTxHistory> txHistories = new ArrayList<>();
            for (EscanTransaction e: ret.getBody().getResult()) {
                TokenTx t = decodeInput(e.getInput());
                EthTxHistory txHistory ;
                // if input is not of type transfer or create considering
                // this is an ETH transaction
                if (t == null) {
                    txHistory = transfromNormalTx(address, e);
                } else {
                    txHistory = transformTokenTx(e, t);
                }
                txHistories.add(txHistory);
            }

            return txHistories;
        } catch (HttpStatusCodeException ex) {
            throw ex;
        }
    }


    private EthTxHistory transformTokenTx(EscanTransaction e, TokenTx t) {
        EthTxHistory txHistory = new EthTxHistory();
        txHistory.setBlockHeight(e.getBlockNumber());
        txHistory.setConfirmations(e.getConfirmations());
        BigDecimal fees = e.getGasPrice().multiply(e.getGasUsed());
        txHistory.setFees(fees);
        txHistory.setTime(e.getTimeStamp());
        txHistory.setTxHash(e.getHash());
        txHistory.setAddressFrom(e.getFrom());
        if (t.action == CONTRACT_ACTION.TRANSFER) {
            txHistory.setAction(ETH_TX_ACTION.CALL_CONTRACT);
            txHistory.setAmount(t.value);
            txHistory.setAddressTo(t.to);
            txHistory.setContractAction(t.action);
        } else if (t.action == CONTRACT_ACTION.CREATE) {
            txHistory.setAction(ETH_TX_ACTION.CALL_CONTRACT);
            txHistory.setAddressTo(e.getTo());
            txHistory.setContractAction(t.action);
        }
//                    else if (t.action == CONTRACT_ACTION.APPROVE) {
//                        txHistory.setAction(ETH_TX_ACTION.CALL_CONTRACT);
//                        txHistory.setContractAction(t.action);
//                    } else if (t.action == CONTRACT_ACTION.TRANSFER_FROM) {
//                        txHistory.setAction(ETH_TX_ACTION.CALL_CONTRACT);
//                        txHistory.setContractAction(t.action);
//                    }
        Erc20Contract contract = address2Contracts.get(e.getContractAddress());
        if (contract != null) {
            txHistory.setSymbol(contract.getSymbol());
            txHistory.setDecimal(contract.getDecimals());
            txHistory.setContractAddress(contract.getContractAddress());
        }
        return txHistory;
    }

    private EthTxHistory transfromNormalTx(String address, EscanTransaction e) {
        EthTxHistory txHistory = new EthTxHistory();
        txHistory.setBlockHeight(e.getBlockNumber());
        txHistory.setConfirmations(e.getConfirmations());
        BigDecimal fees = e.getGasPrice().multiply(e.getGasUsed());
        txHistory.setFees(fees);
        txHistory.setTime(e.getTimeStamp());
        txHistory.setTxHash(e.getHash());
        txHistory.setAddressTo(e.getTo());
        txHistory.setAmount(e.getValue());
        if (txHistory.getAddressTo().equalsIgnoreCase(address)) {
            txHistory.setAction(ETH_TX_ACTION.RECEIVED);
        } else {
            txHistory.setAction(ETH_TX_ACTION.SENT);
        }
        return txHistory;
    }

    public enum CONTRACT_ACTION {
        CREATE, TRANSFER, APPROVE, TRANSFER_FROM
    }
    private static class TokenTx {
        String to;
        BigDecimal value;
        CONTRACT_ACTION action;
    }

    public TokenTx decodeInput(String inputData) {
        try {
            if ( inputData == null || inputData.equalsIgnoreCase("0x") || inputData.length() < 10) {
                return null;
            }
            final String TRANSFER_CODE = "0xa9059cbb";
            final String CREATE_CODE = "0x60806040";
            final String APPROVE_CODE = "0x095ea7b3";
            final String TRANSFER_FROM_CODE = "0x01c6adc3";
            final short ADDRESS_LEN = 40;

            String method = inputData.substring(0,10);
            if (method.equalsIgnoreCase(TRANSFER_CODE)) {
                String to = inputData.substring(10, 74);
//                to = "0x" + to.substring(to.length() - 40, to.length());
                String value = inputData.substring(74);
                Method refMethod = TypeDecoder.class.getDeclaredMethod("decode", String.class, int.class, Class.class);
                refMethod.setAccessible(true);
                Address address = (Address) refMethod.invoke(null, to, 0, Address.class);
                Uint256 amount = (Uint256) refMethod.invoke(null, value, 0, Uint256.class);
                logger.debug("# decodeInput for {}:", inputData);
                logger.debug("\tMethod  {}", method);
                logger.debug("\tMethod  {}", new String(Numeric.hexStringToByteArray(method)), Charset.forName("UTF-8"));
                logger.debug("\tAddress {}", address.toString());
                logger.debug("\tValue {}", amount.getValue());
                TokenTx ret = new TokenTx();
                ret.to = address.toString();
                ret.value = new BigDecimal(amount.getValue());
                ret.action = CONTRACT_ACTION.TRANSFER;
                return ret;
            } else if (method.equalsIgnoreCase(CREATE_CODE)) {
                TokenTx ret = new TokenTx();
                ret.action = CONTRACT_ACTION.CREATE;
                return ret;
            }
            else if (method.equalsIgnoreCase(APPROVE_CODE)) {
                logger.info("Approve transaction");
//                TokenTx ret = new TokenTx();
//                ret.action = CONTRACT_ACTION.APPROVE;
//                return ret;
            } else if (method.equalsIgnoreCase(TRANSFER_FROM_CODE)) {
                logger.info("TransferFrom transaction");
//                TokenTx ret = new TokenTx();
//                ret.action = CONTRACT_ACTION.TRANSFER_FROM;
//                return ret;
            }
            logger.info("decodeInput - Not recognize function code {}", method);
            return null;
        } catch (Exception ex) {
            logger.error("Decode {} fail: {}", inputData, ex.getMessage());
        }
        return null;
    }
}
