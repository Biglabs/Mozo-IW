package com.biglabs.solo.service;

import com.biglabs.solo.domain.Wallet;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Wallet.
 */
public interface WalletService {

    /**
     * Save a wallet.
     *
     * @param wallet the entity to save
     * @return the persisted entity
     */
    Wallet save(Wallet wallet);

    /**
     *  Get all the wallets.
     *
     *  @return the list of entities
     */
    List<Wallet> findAll();

    /**
     *  Get the "id" wallet.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    Wallet findOne(Long id);

    /**
     *  Delete the "id" wallet.
     *
     *  @param id the id of the entity
     */
    void delete(Long id);

    Optional<Wallet> findOneByWalletId(String walletId);
}
