package com.biglabs.solo.service;

import com.biglabs.solo.domain.Address;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.util.List;

/**
 * Service Interface for managing Address.
 */
@Validated
public interface AddressService {

    /**
     * Save a address.
     *
     * @param address the entity to save
     * @return the persisted entity
     */
    Address save(Address address);

    /**
     *  Get all the addresses.
     *
     *  @return the list of entities
     */
    List<Address> findAll();

    /**
     *  Get the "id" address.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    Address findOne(Long id);

    /**
     *  Delete the "id" address.
     *
     *  @param id the id of the entity
     */
    void delete(Long id);

    List<Address> save(@NotEmpty(message = "Addresses is empty")  List<Address> addresses);

    Address findOneByAddress(String address);
    List<Address> findAllAddressIn(List<String> adrHashes);
}
