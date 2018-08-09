package com.biglabs.solo.web.rest;

import com.biglabs.solo.SolomonApp;

import com.biglabs.solo.domain.Address;
import com.biglabs.solo.repository.AddressRepository;
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
import java.math.BigDecimal;
import java.util.List;

import static com.biglabs.solo.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.biglabs.solo.domain.enumeration.CoinType;
import com.biglabs.solo.domain.enumeration.Network;
/**
 * Test class for the AddressResource REST controller.
 *
 * @see AddressResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SolomonApp.class)
public class AddressResourceIntTest {

    private static final CoinType DEFAULT_COIN = CoinType.BTC;
    private static final CoinType UPDATED_COIN = CoinType.ETH;

    private static final Network DEFAULT_NETWORK = Network.BTC_MAIN;
    private static final Network UPDATED_NETWORK = Network.BTC_TEST;

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_BALANCE = new BigDecimal(1);
    private static final BigDecimal UPDATED_BALANCE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_UNCONFIRMED_BALANCE = new BigDecimal(1);
    private static final BigDecimal UPDATED_UNCONFIRMED_BALANCE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_FINAL_BALANCE = new BigDecimal(1);
    private static final BigDecimal UPDATED_FINAL_BALANCE = new BigDecimal(2);

    private static final Long DEFAULT_N_CONFIRMED_TX = 1L;
    private static final Long UPDATED_N_CONFIRMED_TX = 2L;

    private static final Long DEFAULT_N_UNCONFIRMED_TX = 1L;
    private static final Long UPDATED_N_UNCONFIRMED_TX = 2L;

    private static final Long DEFAULT_TOTAL_RECEIVED = 1L;
    private static final Long UPDATED_TOTAL_RECEIVED = 2L;

    private static final Long DEFAULT_TOTAL_SENT = 1L;
    private static final Long UPDATED_TOTAL_SENT = 2L;

    private static final Integer DEFAULT_ACCOUNT_INDEX = 1;
    private static final Integer UPDATED_ACCOUNT_INDEX = 2;

    private static final Integer DEFAULT_CHAIN_INDEX = 1;
    private static final Integer UPDATED_CHAIN_INDEX = 2;

    private static final Integer DEFAULT_ADDRESS_INDEX = 1;
    private static final Integer UPDATED_ADDRESS_INDEX = 2;

    @Autowired
    private AddressRepository addressRepository;

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

    private MockMvc restAddressMockMvc;

    private Address address;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AddressResource addressResource = new AddressResource(addressService);
        this.restAddressMockMvc = MockMvcBuilders.standaloneSetup(addressResource)
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
    public static Address createEntity(EntityManager em) {
        Address address = new Address()
            .coin(DEFAULT_COIN)
            .network(DEFAULT_NETWORK)
            .address(DEFAULT_ADDRESS)
            .balance(DEFAULT_BALANCE)
            .unconfirmedBalance(DEFAULT_UNCONFIRMED_BALANCE)
            .finalBalance(DEFAULT_FINAL_BALANCE)
            .nConfirmedTx(DEFAULT_N_CONFIRMED_TX)
            .nUnconfirmedTx(DEFAULT_N_UNCONFIRMED_TX)
            .totalReceived(DEFAULT_TOTAL_RECEIVED)
            .totalSent(DEFAULT_TOTAL_SENT)
            .accountIndex(DEFAULT_ACCOUNT_INDEX)
            .chainIndex(DEFAULT_CHAIN_INDEX)
            .addressIndex(DEFAULT_ADDRESS_INDEX);
        return address;
    }

    @Before
    public void initTest() {
        address = createEntity(em);
    }

    @Test
    @Transactional
    public void createAddress() throws Exception {
        int databaseSizeBeforeCreate = addressRepository.findAll().size();

        // Create the Address
        restAddressMockMvc.perform(post("/api/addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(address)))
            .andExpect(status().isCreated());

        // Validate the Address in the database
        List<Address> addressList = addressRepository.findAll();
        assertThat(addressList).hasSize(databaseSizeBeforeCreate + 1);
        Address testAddress = addressList.get(addressList.size() - 1);
        assertThat(testAddress.getCoin()).isEqualTo(DEFAULT_COIN);
        assertThat(testAddress.getNetwork()).isEqualTo(DEFAULT_NETWORK);
        assertThat(testAddress.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testAddress.getBalance()).isEqualTo(DEFAULT_BALANCE);
        assertThat(testAddress.getUnconfirmedBalance()).isEqualTo(DEFAULT_UNCONFIRMED_BALANCE);
        assertThat(testAddress.getFinalBalance()).isEqualTo(DEFAULT_FINAL_BALANCE);
        assertThat(testAddress.getnConfirmedTx()).isEqualTo(DEFAULT_N_CONFIRMED_TX);
        assertThat(testAddress.getnUnconfirmedTx()).isEqualTo(DEFAULT_N_UNCONFIRMED_TX);
        assertThat(testAddress.getTotalReceived()).isEqualTo(DEFAULT_TOTAL_RECEIVED);
        assertThat(testAddress.getTotalSent()).isEqualTo(DEFAULT_TOTAL_SENT);
        assertThat(testAddress.getAccountIndex()).isEqualTo(DEFAULT_ACCOUNT_INDEX);
        assertThat(testAddress.getChainIndex()).isEqualTo(DEFAULT_CHAIN_INDEX);
        assertThat(testAddress.getAddressIndex()).isEqualTo(DEFAULT_ADDRESS_INDEX);
    }

    @Test
    @Transactional
    public void createAddressWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = addressRepository.findAll().size();

        // Create the Address with an existing ID
        address.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAddressMockMvc.perform(post("/api/addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(address)))
            .andExpect(status().isBadRequest());

        // Validate the Address in the database
        List<Address> addressList = addressRepository.findAll();
        assertThat(addressList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkCoinIsRequired() throws Exception {
        int databaseSizeBeforeTest = addressRepository.findAll().size();
        // set the field null
        address.setCoin(null);

        // Create the Address, which fails.

        restAddressMockMvc.perform(post("/api/addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(address)))
            .andExpect(status().isBadRequest());

        List<Address> addressList = addressRepository.findAll();
        assertThat(addressList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNetworkIsRequired() throws Exception {
        int databaseSizeBeforeTest = addressRepository.findAll().size();
        // set the field null
        address.setNetwork(null);

        // Create the Address, which fails.

        restAddressMockMvc.perform(post("/api/addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(address)))
            .andExpect(status().isBadRequest());

        List<Address> addressList = addressRepository.findAll();
        assertThat(addressList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = addressRepository.findAll().size();
        // set the field null
        address.setAddress(null);

        // Create the Address, which fails.

        restAddressMockMvc.perform(post("/api/addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(address)))
            .andExpect(status().isBadRequest());

        List<Address> addressList = addressRepository.findAll();
        assertThat(addressList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAccountIndexIsRequired() throws Exception {
        int databaseSizeBeforeTest = addressRepository.findAll().size();
        // set the field null
        address.setAccountIndex(null);

        // Create the Address, which fails.

        restAddressMockMvc.perform(post("/api/addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(address)))
            .andExpect(status().isBadRequest());

        List<Address> addressList = addressRepository.findAll();
        assertThat(addressList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkChainIndexIsRequired() throws Exception {
        int databaseSizeBeforeTest = addressRepository.findAll().size();
        // set the field null
        address.setChainIndex(null);

        // Create the Address, which fails.

        restAddressMockMvc.perform(post("/api/addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(address)))
            .andExpect(status().isBadRequest());

        List<Address> addressList = addressRepository.findAll();
        assertThat(addressList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAddressIndexIsRequired() throws Exception {
        int databaseSizeBeforeTest = addressRepository.findAll().size();
        // set the field null
        address.setAddressIndex(null);

        // Create the Address, which fails.

        restAddressMockMvc.perform(post("/api/addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(address)))
            .andExpect(status().isBadRequest());

        List<Address> addressList = addressRepository.findAll();
        assertThat(addressList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAddresses() throws Exception {
        // Initialize the database
        addressRepository.saveAndFlush(address);

        // Get all the addressList
        restAddressMockMvc.perform(get("/api/addresses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(address.getId().intValue())))
            .andExpect(jsonPath("$.[*].coin").value(hasItem(DEFAULT_COIN.toString())))
            .andExpect(jsonPath("$.[*].network").value(hasItem(DEFAULT_NETWORK.toString())))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS.toString())))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(DEFAULT_BALANCE.intValue())))
            .andExpect(jsonPath("$.[*].unconfirmedBalance").value(hasItem(DEFAULT_UNCONFIRMED_BALANCE.intValue())))
            .andExpect(jsonPath("$.[*].finalBalance").value(hasItem(DEFAULT_FINAL_BALANCE.intValue())))
            .andExpect(jsonPath("$.[*].nConfirmedTx").value(hasItem(DEFAULT_N_CONFIRMED_TX.intValue())))
            .andExpect(jsonPath("$.[*].nUnconfirmedTx").value(hasItem(DEFAULT_N_UNCONFIRMED_TX.intValue())))
            .andExpect(jsonPath("$.[*].totalReceived").value(hasItem(DEFAULT_TOTAL_RECEIVED.intValue())))
            .andExpect(jsonPath("$.[*].totalSent").value(hasItem(DEFAULT_TOTAL_SENT.intValue())))
            .andExpect(jsonPath("$.[*].accountIndex").value(hasItem(DEFAULT_ACCOUNT_INDEX)))
            .andExpect(jsonPath("$.[*].chainIndex").value(hasItem(DEFAULT_CHAIN_INDEX)))
            .andExpect(jsonPath("$.[*].addressIndex").value(hasItem(DEFAULT_ADDRESS_INDEX)));
    }

    @Test
    @Transactional
    public void getAddress() throws Exception {
        // Initialize the database
        addressRepository.saveAndFlush(address);

        // Get the address
        restAddressMockMvc.perform(get("/api/addresses/{id}", address.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(address.getId().intValue()))
            .andExpect(jsonPath("$.coin").value(DEFAULT_COIN.toString()))
            .andExpect(jsonPath("$.network").value(DEFAULT_NETWORK.toString()))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS.toString()))
            .andExpect(jsonPath("$.balance").value(DEFAULT_BALANCE.intValue()))
            .andExpect(jsonPath("$.unconfirmedBalance").value(DEFAULT_UNCONFIRMED_BALANCE.intValue()))
            .andExpect(jsonPath("$.finalBalance").value(DEFAULT_FINAL_BALANCE.intValue()))
            .andExpect(jsonPath("$.nConfirmedTx").value(DEFAULT_N_CONFIRMED_TX.intValue()))
            .andExpect(jsonPath("$.nUnconfirmedTx").value(DEFAULT_N_UNCONFIRMED_TX.intValue()))
            .andExpect(jsonPath("$.totalReceived").value(DEFAULT_TOTAL_RECEIVED.intValue()))
            .andExpect(jsonPath("$.totalSent").value(DEFAULT_TOTAL_SENT.intValue()))
            .andExpect(jsonPath("$.accountIndex").value(DEFAULT_ACCOUNT_INDEX))
            .andExpect(jsonPath("$.chainIndex").value(DEFAULT_CHAIN_INDEX))
            .andExpect(jsonPath("$.addressIndex").value(DEFAULT_ADDRESS_INDEX));
    }

    @Test
    @Transactional
    public void getNonExistingAddress() throws Exception {
        // Get the address
        restAddressMockMvc.perform(get("/api/addresses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAddress() throws Exception {
        // Initialize the database
        addressService.save(address);

        int databaseSizeBeforeUpdate = addressRepository.findAll().size();

        // Update the address
        Address updatedAddress = addressRepository.findOne(address.getId());
        updatedAddress
            .coin(UPDATED_COIN)
            .network(UPDATED_NETWORK)
            .address(UPDATED_ADDRESS)
            .balance(UPDATED_BALANCE)
            .unconfirmedBalance(UPDATED_UNCONFIRMED_BALANCE)
            .finalBalance(UPDATED_FINAL_BALANCE)
            .nConfirmedTx(UPDATED_N_CONFIRMED_TX)
            .nUnconfirmedTx(UPDATED_N_UNCONFIRMED_TX)
            .totalReceived(UPDATED_TOTAL_RECEIVED)
            .totalSent(UPDATED_TOTAL_SENT)
            .accountIndex(UPDATED_ACCOUNT_INDEX)
            .chainIndex(UPDATED_CHAIN_INDEX)
            .addressIndex(UPDATED_ADDRESS_INDEX);

        restAddressMockMvc.perform(put("/api/addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAddress)))
            .andExpect(status().isOk());

        // Validate the Address in the database
        List<Address> addressList = addressRepository.findAll();
        assertThat(addressList).hasSize(databaseSizeBeforeUpdate);
        Address testAddress = addressList.get(addressList.size() - 1);
        assertThat(testAddress.getCoin()).isEqualTo(UPDATED_COIN);
        assertThat(testAddress.getNetwork()).isEqualTo(UPDATED_NETWORK);
        assertThat(testAddress.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testAddress.getBalance()).isEqualTo(UPDATED_BALANCE);
        assertThat(testAddress.getUnconfirmedBalance()).isEqualTo(UPDATED_UNCONFIRMED_BALANCE);
        assertThat(testAddress.getFinalBalance()).isEqualTo(UPDATED_FINAL_BALANCE);
        assertThat(testAddress.getnConfirmedTx()).isEqualTo(UPDATED_N_CONFIRMED_TX);
        assertThat(testAddress.getnUnconfirmedTx()).isEqualTo(UPDATED_N_UNCONFIRMED_TX);
        assertThat(testAddress.getTotalReceived()).isEqualTo(UPDATED_TOTAL_RECEIVED);
        assertThat(testAddress.getTotalSent()).isEqualTo(UPDATED_TOTAL_SENT);
        assertThat(testAddress.getAccountIndex()).isEqualTo(UPDATED_ACCOUNT_INDEX);
        assertThat(testAddress.getChainIndex()).isEqualTo(UPDATED_CHAIN_INDEX);
        assertThat(testAddress.getAddressIndex()).isEqualTo(UPDATED_ADDRESS_INDEX);
    }

    @Test
    @Transactional
    public void updateNonExistingAddress() throws Exception {
        int databaseSizeBeforeUpdate = addressRepository.findAll().size();

        // Create the Address

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAddressMockMvc.perform(put("/api/addresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(address)))
            .andExpect(status().isCreated());

        // Validate the Address in the database
        List<Address> addressList = addressRepository.findAll();
        assertThat(addressList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteAddress() throws Exception {
        // Initialize the database
        addressService.save(address);

        int databaseSizeBeforeDelete = addressRepository.findAll().size();

        // Get the address
        restAddressMockMvc.perform(delete("/api/addresses/{id}", address.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Address> addressList = addressRepository.findAll();
        assertThat(addressList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Address.class);
        Address address1 = new Address();
        address1.setId(1L);
        Address address2 = new Address();
        address2.setId(address1.getId());
        assertThat(address1).isEqualTo(address2);
        address2.setId(2L);
        assertThat(address1).isNotEqualTo(address2);
        address1.setId(null);
        assertThat(address1).isNotEqualTo(address2);
    }
}