package com.biglabs.solo.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.biglabs.solo.domain.Address;
import com.biglabs.solo.service.AddressService;
import com.biglabs.solo.web.rest.errors.BadRequestAlertException;
import com.biglabs.solo.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Address.
 */
@RestController
@RequestMapping("/api")
public class AddressResource {

    private final Logger log = LoggerFactory.getLogger(AddressResource.class);

    private static final String ENTITY_NAME = "address";

    private final AddressService addressService;

    public AddressResource(AddressService addressService) {
        this.addressService = addressService;
    }
//
//    /**
//     * POST  /addresses : Create a new address.
//     *
//     * @param address the address to create
//     * @return the ResponseEntity with status 201 (Created) and with body the new address, or with status 400 (Bad Request) if the address has already an ID
//     * @throws URISyntaxException if the Location URI syntax is incorrect
//     */
//    @PostMapping("/addresses")
//    @Timed
//    public ResponseEntity<Address> createAddress(@Valid @RequestBody Address address) throws URISyntaxException {
//        log.debug("REST request to save Address : {}", address);
//        if (address.getId() != null) {
//            throw new BadRequestAlertException("A new address cannot already have an ID", ENTITY_NAME, "idexists");
//        }
//        if (addressService.findOneByAddress(address.getAddress()) != null) {
//            throw new BadRequestAlertException("Address " + address.getAddress() + " exists", ENTITY_NAME, "idexists");
//        }
//        Address result = addressService.save(address);
//        return ResponseEntity.created(new URI("/api/addresses/" + result.getId()))
//            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
//            .body(result);
//    }
//
//    /**
//     * PUT  /addresses : Updates an existing address.
//     *
//     * @param address the address to update
//     * @return the ResponseEntity with status 200 (OK) and with body the updated address,
//     * or with status 400 (Bad Request) if the address is not valid,
//     * or with status 500 (Internal Server Error) if the address couldn't be updated
//     * @throws URISyntaxException if the Location URI syntax is incorrect
//     */
//    @PutMapping("/addresses")
//    @Timed
//    public ResponseEntity<Address> updateAddress(@Valid @RequestBody Address address) throws URISyntaxException {
//        log.debug("REST request to update Address : {}", address);
//        if (address.getId() == null) {
//            return createAddress(address);
//        }
//        Address result = addressService.save(address);
//        return ResponseEntity.ok()
//            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, address.getId().toString()))
//            .body(result);
//    }
//
//    /**
//     * GET  /addresses : get all the addresses.
//     *
//     * @return the ResponseEntity with status 200 (OK) and the list of addresses in body
//     */
//    @GetMapping("/addresses")
//    @Timed
//    public List<Address> getAllAddresses() {
//        log.debug("REST request to get all Addresses");
//        return addressService.findAll();
//    }
//
//    /**
//     * GET  /addresses/:id : get the "id" address.
//     *
//     * @param id the id of the address to retrieve
//     * @return the ResponseEntity with status 200 (OK) and with body the address, or with status 404 (Not Found)
//     */
//    @GetMapping("/addresses/{id}")
//    @Timed
//    public ResponseEntity<Address> getAddress(@PathVariable Long id) {
//        log.debug("REST request to get Address : {}", id);
//        Address address = addressService.findOne(id);
//        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(address));
//    }
//
//    /**
//     * DELETE  /addresses/:id : delete the "id" address.
//     *
//     * @param id the id of the address to delete
//     * @return the ResponseEntity with status 200 (OK)
//     */
//    @DeleteMapping("/addresses/{id}")
//    @Timed
//    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
//        log.debug("REST request to delete Address : {}", id);
//        addressService.delete(id);
//        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
//    }
}
