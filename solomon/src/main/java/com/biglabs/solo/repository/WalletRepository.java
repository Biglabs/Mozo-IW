package com.biglabs.solo.repository;

import com.biglabs.solo.domain.Wallet;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.Optional;


/**
 * Spring Data JPA repository for the Wallet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findOneByWalletId(String walletId);
    Optional<Wallet> findOneByWalletKey(String walletKey);
}
