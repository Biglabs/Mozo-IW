package com.biglabs.solo.web.rest;

import com.biglabs.solo.SolomonApp;

import com.biglabs.solo.domain.WalletAddress;
import com.biglabs.solo.domain.Wallet;
import com.biglabs.solo.repository.WalletAddressRepository;
import com.biglabs.solo.service.AddressService;
import com.biglabs.solo.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static com.biglabs.solo.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the WalletAddressResource REST controller.
 *
 * @see WalletAddressResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SolomonApp.class)
public class WalletAddressResourceIntTest {

    private static final Boolean DEFAULT_IN_USE = false;
    private static final Boolean UPDATED_IN_USE = true;

    @Autowired
    private WalletAddressRepository walletAddressRepository;

    @Autowired
    private AddressService addressService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restWalletAddressMockMvc;

    private WalletAddress walletAddress;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final WalletAddressResource walletAddressResource = new WalletAddressResource(walletAddressRepository, addressService, null);
        this.restWalletAddressMockMvc = MockMvcBuilders.standaloneSetup(walletAddressResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WalletAddress createEntity(EntityManager em) {
        WalletAddress walletAddress = new WalletAddress()
            .inUse(DEFAULT_IN_USE);
        // Add required entity
        Wallet wallet = WalletResourceIntTest.createEntity(em);
        em.persist(wallet);
        em.flush();
        walletAddress.setWallet(wallet);
        return walletAddress;
    }

    @Before
    public void initTest() {
        walletAddress = createEntity(em);
    }

    @Test
    @Transactional
    public void createWalletAddress() throws Exception {
        int databaseSizeBeforeCreate = walletAddressRepository.findAll().size();

        // Create the WalletAddress
        restWalletAddressMockMvc.perform(post("/api/wallet-addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(walletAddress)))
            .andExpect(status().isCreated());

        // Validate the WalletAddress in the database
        List<WalletAddress> walletAddressList = walletAddressRepository.findAll();
        assertThat(walletAddressList).hasSize(databaseSizeBeforeCreate + 1);
        WalletAddress testWalletAddress = walletAddressList.get(walletAddressList.size() - 1);
        assertThat(testWalletAddress.isInUse()).isEqualTo(DEFAULT_IN_USE);
    }

    @Test
    @Transactional
    public void createWalletAddressWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = walletAddressRepository.findAll().size();

        // Create the WalletAddress with an existing ID
        walletAddress.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWalletAddressMockMvc.perform(post("/api/wallet-addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(walletAddress)))
            .andExpect(status().isBadRequest());

        // Validate the WalletAddress in the database
        List<WalletAddress> walletAddressList = walletAddressRepository.findAll();
        assertThat(walletAddressList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllWalletAddresses() throws Exception {
        // Initialize the database
        walletAddressRepository.saveAndFlush(walletAddress);

        // Get all the walletAddressList
        restWalletAddressMockMvc.perform(get("/api/wallet-addresses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(walletAddress.getId().intValue())))
            .andExpect(jsonPath("$.[*].inUse").value(hasItem(DEFAULT_IN_USE.booleanValue())));
    }

    @Test
    @Transactional
    public void getWalletAddress() throws Exception {
        // Initialize the database
        walletAddressRepository.saveAndFlush(walletAddress);

        // Get the walletAddress
        restWalletAddressMockMvc.perform(get("/api/wallet-addresses/{id}", walletAddress.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(walletAddress.getId().intValue()))
            .andExpect(jsonPath("$.inUse").value(DEFAULT_IN_USE.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingWalletAddress() throws Exception {
        // Get the walletAddress
        restWalletAddressMockMvc.perform(get("/api/wallet-addresses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWalletAddress() throws Exception {
        // Initialize the database
        walletAddressRepository.saveAndFlush(walletAddress);
        int databaseSizeBeforeUpdate = walletAddressRepository.findAll().size();

        // Update the walletAddress
        WalletAddress updatedWalletAddress = walletAddressRepository.findOne(walletAddress.getId());
        updatedWalletAddress
            .inUse(UPDATED_IN_USE);

        restWalletAddressMockMvc.perform(put("/api/wallet-addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedWalletAddress)))
            .andExpect(status().isOk());

        // Validate the WalletAddress in the database
        List<WalletAddress> walletAddressList = walletAddressRepository.findAll();
        assertThat(walletAddressList).hasSize(databaseSizeBeforeUpdate);
        WalletAddress testWalletAddress = walletAddressList.get(walletAddressList.size() - 1);
        assertThat(testWalletAddress.isInUse()).isEqualTo(UPDATED_IN_USE);
    }

    @Test
    @Transactional
    public void updateNonExistingWalletAddress() throws Exception {
        int databaseSizeBeforeUpdate = walletAddressRepository.findAll().size();

        // Create the WalletAddress

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restWalletAddressMockMvc.perform(put("/api/wallet-addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(walletAddress)))
            .andExpect(status().isCreated());

        // Validate the WalletAddress in the database
        List<WalletAddress> walletAddressList = walletAddressRepository.findAll();
        assertThat(walletAddressList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteWalletAddress() throws Exception {
        // Initialize the database
        walletAddressRepository.saveAndFlush(walletAddress);
        int databaseSizeBeforeDelete = walletAddressRepository.findAll().size();

        // Get the walletAddress
        restWalletAddressMockMvc.perform(delete("/api/wallet-addresses/{id}", walletAddress.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<WalletAddress> walletAddressList = walletAddressRepository.findAll();
        assertThat(walletAddressList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WalletAddress.class);
        WalletAddress walletAddress1 = new WalletAddress();
        walletAddress1.setId(1L);
        WalletAddress walletAddress2 = new WalletAddress();
        walletAddress2.setId(walletAddress1.getId());
        assertThat(walletAddress1).isEqualTo(walletAddress2);
        walletAddress2.setId(2L);
        assertThat(walletAddress1).isNotEqualTo(walletAddress2);
        walletAddress1.setId(null);
        assertThat(walletAddress1).isNotEqualTo(walletAddress2);
    }
}
