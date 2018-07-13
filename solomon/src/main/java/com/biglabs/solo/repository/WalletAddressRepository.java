package com.biglabs.solo.repository;

import com.biglabs.solo.domain.Address;
import com.biglabs.solo.domain.WalletAddress;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the WalletAddress entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WalletAddressRepository extends JpaRepository<WalletAddress, Long> {


    @Query("select wa.address from WalletAddress wa where wa.wallet.walletId = ?1")
    List<Address> findAddressesByWalletId(String walletId);

    List<WalletAddress> findWalletAddressByWallet_WalletId(String walletId);
}
