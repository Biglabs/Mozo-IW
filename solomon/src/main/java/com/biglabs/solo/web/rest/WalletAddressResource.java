package com.biglabs.solo.web.rest;

import com.biglabs.solo.domain.Address;
import com.biglabs.solo.domain.Wallet;
import com.biglabs.solo.service.AddressService;
import com.biglabs.solo.service.WalletService;
import com.biglabs.solo.web.rest.vm.WalletAddressVM;
import com.codahale.metrics.annotation.Timed;
import com.biglabs.solo.domain.WalletAddress;

import com.biglabs.solo.repository.WalletAddressRepository;
import com.biglabs.solo.web.rest.errors.BadRequestAlertException;
import com.biglabs.solo.web.rest.util.HeaderUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.jhipster.web.util.ResponseUtil;
import org.hibernate.validator.constraints.NotEmpty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for managing WalletAddress.
 */
@RestController
@RequestMapping("/api")
public class WalletAddressResource {

    private final Logger log = LoggerFactory.getLogger(WalletAddressResource.class);

    private static final String ENTITY_NAME = "walletAddress";

    private final WalletAddressRepository walletAddressRepository;
    private final AddressService addressService;
    private final WalletService walletService;
    @Autowired
    private ObjectMapper jacksonObjectMapper;

    public WalletAddressResource(WalletAddressRepository walletAddressRepository, AddressService addressService, WalletService walletService) {
        this.walletAddressRepository = walletAddressRepository;
        this.addressService = addressService;
        this.walletService = walletService;
    }

    /**
     * POST  /wallet-addresses : Create a new walletAddress.
     *
     * @param walletAddressVM the walletAddressVM to create
     * @return the ResponseEntity with status 201 (Created) and with body the new walletAddress, or with status 400 (Bad Request) if the walletAddress has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/wallet-addresses")
    @Timed
    public ResponseEntity<List<WalletAddress>> linkWalletAddress(@Valid @RequestBody WalletAddressVM walletAddressVM) throws URISyntaxException, JsonProcessingException {
        log.debug("REST request to save WalletAddress : {}", walletAddressVM);
        if (walletAddressVM.getWalletId() == null) {
            throw new BadRequestAlertException("No wallet provided", ENTITY_NAME, "nowallet");
        }

        return bulkSavingAddresses(walletAddressVM.getWalletId(), walletAddressVM.getAddresses());
//        Address address = addressService.save(walletAddressVM.getAddresses());
//        WalletAddress walletAddress = new WalletAddress();
//        walletAddress.setAddress(address);
////        walletAddress.setWallet();
//        Optional<Wallet> w = walletService.findOneByWalletId(walletAddressVM.getWalletId());
//        walletAddress.setWallet(w.get());
//        walletAddress.setInUse(true);
//        WalletAddress result = walletAddressRepository.save(walletAddress);
//        return ResponseEntity.created(new URI("/api/wallet-addresses/" + result.getId()))
//            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
//            .body(result);
    }


    @Validated
    @Transactional
    public ResponseEntity<List<WalletAddress>> bulkSavingAddresses(String walletId, @NotEmpty(message = "Addresses is empty") List<Address> addresses) throws URISyntaxException, JsonProcessingException {
        log.debug("REST request to save WalletAddress : {}", walletId);
        log.debug("=== Addresses <<<");
        log.debug(jacksonObjectMapper.writeValueAsString(addresses));
        log.debug("=== Addresses >>>");
        if (walletId == null) {
            throw new BadRequestAlertException("No wallet provided", ENTITY_NAME, "nowallet");
        }

        Optional<Wallet> w = walletService.findOneByWalletId(walletId);
        if (!w.isPresent()) {
            throw new BadRequestAlertException("Wallet " + walletId + " not exist.", ENTITY_NAME, "nowallet");
        }
        log.debug("Wallet {}", jacksonObjectMapper.writeValueAsString(w.get()));

        // create or update addresses
        List<Address> existedAdrs = addressService.findAllAddressIn(addresses.stream().map(adr -> adr.getAddress()).collect(Collectors.toList()));
        List<String> addressNetwork = existedAdrs.stream().map(adr -> addressIdentity(adr)).collect(Collectors.toList());
        List<Address> newAddress = addresses.stream()
            .filter(adr -> !addressNetwork.contains(addressIdentity(adr)))
            .collect(Collectors.toList());

        List<Address> newSavedAddress = addressService.save(newAddress);
        existedAdrs.addAll(newSavedAddress);

        //Link wallet and unlink address
        List<WalletAddress> was = walletAddressRepository.findWalletAddressByWallet_WalletId(walletId);
        List<String> linkedAddress = was.stream().map(wadr -> addressIdentity(wadr.getAddress())).collect(Collectors.toList());
        List<Address> unlinkAddress = existedAdrs.stream().filter(adr -> !linkedAddress.contains(addressIdentity(adr))).collect(Collectors.toList());

        unlinkAddress.forEach(address -> log.debug("Unlink address {}, {}", address.getId(), address.getAddress()));

        List<WalletAddress> newWAs = unlinkAddress.stream().map(adr -> {
            WalletAddress walletAddress = new WalletAddress();
            walletAddress.setAddress(adr);
            walletAddress.setWallet(w.get());
            walletAddress.setInUse(true);
            return walletAddress;
        }).collect(Collectors.toList());

        newWAs = walletAddressRepository.save(newWAs);
        was.addAll(newWAs);
        return ResponseEntity.ok()
            .body(was);
    }

    private String addressIdentity(Address adr) {
        return String.join("-", adr.getAddress(), adr.getNetwork().toString());
    }

//    /**
//     * POST  /wallet-addresses : Create a new walletAddress.
//     *
//     * @param walletAddress the walletAddress to create
//     * @return the ResponseEntity with status 201 (Created) and with body the new walletAddress, or with status 400 (Bad Request) if the walletAddress has already an ID
//     * @throws URISyntaxException if the Location URI syntax is incorrect
//     */
////    @PostMapping("/wallet-addresses")
//    @Timed
//    public ResponseEntity<WalletAddress> createWalletAddress(@Valid @RequestBody WalletAddress walletAddress) throws URISyntaxException {
//        log.debug("REST request to save WalletAddress : {}", walletAddress);
//        if (walletAddress.getId() != null) {
//            throw new BadRequestAlertException("A new walletAddress cannot already have an ID", ENTITY_NAME, "idexists");
//        }
//        Address newAddress = addressService.save(walletAddress.getAddress());
//        walletAddress.setAddress(newAddress);
//        Optional<Wallet> w = walletService.findOneByWalletId(walletAddress.getWallet().getWalletId());
//        walletAddress.setWallet(w.get());
//        walletAddress.setInUse(true);
//        WalletAddress result = walletAddressRepository.save(walletAddress);
//        return ResponseEntity.created(new URI("/api/wallet-addresses/" + result.getId()))
//            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
//            .body(result);
//    }

//    /**
//     * PUT  /wallet-addresses : Updates an existing walletAddress.
//     *
//     * @param walletAddress the walletAddress to update
//     * @return the ResponseEntity with status 200 (OK) and with body the updated walletAddress,
//     * or with status 400 (Bad Request) if the walletAddress is not valid,
//     * or with status 500 (Internal Server Error) if the walletAddress couldn't be updated
//     * @throws URISyntaxException if the Location URI syntax is incorrect
//     */
//    @PutMapping("/wallet-addresses")
//    @Timed
//    public ResponseEntity<WalletAddress> updateWalletAddress(@Valid @RequestBody WalletAddress walletAddress) throws URISyntaxException {
//        log.debug("REST request to update WalletAddress : {}", walletAddress);
//        if (walletAddress.getId() == null) {
//            return createWalletAddress(walletAddress);
//        }
//        WalletAddress result = walletAddressRepository.save(walletAddress);
//        return ResponseEntity.ok()
//            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, walletAddress.getId().toString()))
//            .body(result);
//    }

//    /**
//     * GET  /wallet-addresses : get all the walletAddresses.
//     *
//     * @return the ResponseEntity with status 200 (OK) and the list of walletAddresses in body
//     */
//    @GetMapping("/wallet-addresses")
//    @Timed
//    public List<WalletAddress> getAllWalletAddresses() {
//        log.debug("REST request to get all WalletAddresses");
//        return walletAddressRepository.findAll();
//        }
//
//    /**
//     * GET  /wallet-addresses/:id : get the "id" walletAddress.
//     *
//     * @param id the id of the walletAddress to retrieve
//     * @return the ResponseEntity with status 200 (OK) and with body the walletAddress, or with status 404 (Not Found)
//     */
//    @GetMapping("/wallet-addresses/{id}")
//    @Timed
//    public ResponseEntity<WalletAddress> getWalletAddress(@PathVariable Long id) {
//        log.debug("REST request to get WalletAddress : {}", id);
//        WalletAddress walletAddress = walletAddressRepository.findOne(id);
//        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(walletAddress));
//    }
//
//    /**
//     * DELETE  /wallet-addresses/:id : delete the "id" walletAddress.
//     *
//     * @param id the id of the walletAddress to delete
//     * @return the ResponseEntity with status 200 (OK)
//     */
//    @DeleteMapping("/wallet-addresses/{id}")
//    @Timed
//    public ResponseEntity<Void> deleteWalletAddress(@PathVariable Long id) {
//        log.debug("REST request to delete WalletAddress : {}", id);
//        walletAddressRepository.delete(id);
//        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
//    }
}
