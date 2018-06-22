package com.biglabs.solo.service.impl;

import com.biglabs.solo.service.WalletService;
import com.biglabs.solo.domain.Wallet;
import com.biglabs.solo.repository.WalletRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing Wallet.
 */
@Service
@Transactional
public class WalletServiceImpl implements WalletService{

    private final Logger log = LoggerFactory.getLogger(WalletServiceImpl.class);

    private final WalletRepository walletRepository;

    public WalletServiceImpl(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    /**
     * Save a wallet.
     *
     * @param wallet the entity to save
     * @return the persisted entity
     */
    @Override
    public Wallet save(Wallet wallet) {
        log.debug("Request to save Wallet : {}", wallet);
        return walletRepository.save(wallet);
    }

    /**
     *  Get all the wallets.
     *
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Wallet> findAll() {
        log.debug("Request to get all Wallets");
        return walletRepository.findAll();
    }

    /**
     *  Get one wallet by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Wallet findOne(Long id) {
        log.debug("Request to get Wallet : {}", id);
        return walletRepository.findOne(id);
    }

    /**
     *  Delete the  wallet by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Wallet : {}", id);
        walletRepository.delete(id);
    }

    @Override
    public Optional<Wallet> findOneByWalletId(String walletId) {
        log.debug("Find one by wallet id {}", walletId);
        return walletRepository.findOneByWalletId(walletId);
    }

    @Override
    public Optional<Wallet> findOneByWalletKey(String walletKey) {
        log.debug("Find one by wallet key {}", walletKey);
        return walletRepository.findOneByWalletKey(walletKey);
    }
}
