package com.biglabs.solo.web.rest;

import com.biglabs.solo.domain.Address;
import com.biglabs.solo.repository.WalletAddressRepository;
import com.codahale.metrics.annotation.Timed;
import com.biglabs.solo.domain.Wallet;
import com.biglabs.solo.service.WalletService;
import com.biglabs.solo.web.rest.errors.BadRequestAlertException;
import com.biglabs.solo.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.xml.bind.DatatypeConverter;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * REST controller for managing Wallet.
 */
@RestController
@RequestMapping("/api")
public class WalletResource {

    private final Logger log = LoggerFactory.getLogger(WalletResource.class);

    private static final String ENTITY_NAME = "wallet";

    private final WalletService walletService;

    @Autowired
    private WalletAddressRepository walletAddressRepository;

    public WalletResource(WalletService walletService) {
        this.walletService = walletService;
    }

    /**
     * POST  /wallets : Create a new wallet.
     *
     * @param wallet the wallet to create
     * @return the ResponseEntity with status 201 (Created) and with body the new wallet, or with status 400 (Bad Request) if the wallet has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/wallets")
    @Timed
    public ResponseEntity<Wallet> createWallet(@Valid @RequestBody Wallet wallet) throws URISyntaxException, NoSuchAlgorithmException, UnsupportedEncodingException {
        log.debug("REST request to save Wallet : {}", wallet);
        if (wallet.getId() != null) {
            throw new BadRequestAlertException("A new wallet cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (walletService.findOneByWalletKey(wallet.getWalletKey()).isPresent()) {
            throw new BadRequestAlertException("A wallet with same key exist: " + wallet.getWalletKey(), ENTITY_NAME, "idexists");
        }

        UUID newId = UUID.randomUUID();
        MessageDigest md5 = MessageDigest.getInstance("MD5");
        wallet.setWalletId(DatatypeConverter.printHexBinary(md5.digest(newId.toString().getBytes("UTF-8"))));
        Wallet result = walletService.save(wallet);
        return ResponseEntity.created(new URI("/api/wallets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /wallets : Updates an existing wallet.
     *
     * @param wallet the wallet to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated wallet,
     * or with status 400 (Bad Request) if the wallet is not valid,
     * or with status 500 (Internal Server Error) if the wallet couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/wallets")
    @Timed
    public ResponseEntity<Wallet> updateWallet(@Valid @RequestBody Wallet wallet) throws URISyntaxException, UnsupportedEncodingException, NoSuchAlgorithmException {
        log.debug("REST request to update Wallet : {}", wallet);
        if (wallet.getId() == null) {
            return createWallet(wallet);
        }
        Wallet result = walletService.save(wallet);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, wallet.getId().toString()))
            .body(result);
    }

    /**
     * GET  /wallets : get all the wallets.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of wallets in body
     */
    @GetMapping("/wallets")
    @Timed
    public List<Wallet> getAllWallets() {
        log.debug("REST request to get all Wallets");
        return walletService.findAll();
        }

    /**
     * GET  /wallets/:id : get the "id" wallet.
     *
     * @param id the id of the wallet to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the wallet, or with status 404 (Not Found)
     */
//    @GetMapping("/wallets/{id}")
//    @Timed
//    public ResponseEntity<Wallet> getWallet(@PathVariable Long id) {
//        log.debug("REST request to get Wallet : {}", id);
//        Wallet wallet = walletService.findOne(id);
//        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(wallet));
//    }

    /**
     * GET  /wallets/:walletKey : get the "walletKey" wallet.
     *
     * @param walletKey the walletKey of the wallet to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the wallet, or with status 404 (Not Found)
     */
    @GetMapping("/wallets/{walletKey}")
    @Timed
    public ResponseEntity<Wallet> getWalletByWalletKey(@PathVariable String walletKey) {
        log.debug("REST request to get Wallet : {}", walletKey);
        Optional<Wallet> wallet = walletService.findOneByWalletKey(walletKey);
        return ResponseUtil.wrapOrNotFound(wallet);
    }

    /**
     * GET  /wallets/:walletId/addresses : get addresses of wallet.
     *
     * @param walletId the walletId of the wallet to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the wallet, or with status 404 (Not Found)
     */
    @GetMapping("/wallets/{walletId}/addresses")
    @Timed
    public List<Address> getAddresses(@PathVariable String walletId) {
        log.debug("REST request to get Wallet : {}", walletId);
        List<Address> addresses = walletAddressRepository.findAddressesByWallet_WalletId(walletId);
        return addresses;
    }

    /**
     * DELETE  /wallets/:id : delete the "id" wallet.
     *
     * @param id the id of the wallet to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/wallets/{id}")
    @Timed
    public ResponseEntity<Void> deleteWallet(@PathVariable Long id) {
        log.debug("REST request to delete Wallet : {}", id);
        walletService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
