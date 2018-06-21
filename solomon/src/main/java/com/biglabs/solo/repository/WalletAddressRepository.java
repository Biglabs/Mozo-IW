package com.biglabs.solo.repository;

import com.biglabs.solo.domain.WalletAddress;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the WalletAddress entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WalletAddressRepository extends JpaRepository<WalletAddress, Long> {

}
