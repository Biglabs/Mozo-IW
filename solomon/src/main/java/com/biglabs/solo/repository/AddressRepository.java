package com.biglabs.solo.repository;

import com.biglabs.solo.domain.Address;
import com.biglabs.solo.domain.enumeration.Network;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;
import java.util.Optional;


/**
 * Spring Data JPA repository for the Address entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    Address findAddressByAddress(String address);
    List<Address> findAllByAddressIn(List<String> addressHashes);
    Optional<Address> findAddressByAddressAndNetwork(String address, Network network);
}
