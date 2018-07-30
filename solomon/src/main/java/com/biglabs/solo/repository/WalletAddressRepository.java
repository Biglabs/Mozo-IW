package com.biglabs.solo.repository;

import com.biglabs.solo.domain.Address;
import com.biglabs.solo.domain.WalletAddress;
import com.biglabs.solo.domain.enumeration.Network;
import org.hibernate.persister.walking.spi.WalkingException;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import sun.nio.ch.Net;

import java.util.List;
import java.util.Optional;


/**
 * Spring Data JPA repository for the WalletAddress entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WalletAddressRepository extends JpaRepository<WalletAddress, Long> {


    @Query("select wa.address from WalletAddress wa where wa.wallet.walletId = ?1")
    List<Address> findAddressesByWallet_WalletId(String walletId);

    List<WalletAddress> findWalletAddressByWallet_WalletId(String walletId);
    Optional<WalletAddress> findFirstByAddress_Address(String address);
    Optional<WalletAddress> findFirstByWallet_WalletIdAndAddress_AddressAndAddress_Network(String walletId, String AddressId, Network network);
}
