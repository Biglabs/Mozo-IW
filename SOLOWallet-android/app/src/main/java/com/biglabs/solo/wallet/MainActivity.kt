package com.biglabs.solo.wallet

import android.arch.lifecycle.ViewModelProviders
import android.graphics.Typeface
import android.os.Bundle
import android.support.v4.app.Fragment
import android.support.v4.content.res.ResourcesCompat
import android.support.v4.view.GravityCompat
import android.support.v7.app.AppCompatActivity
import android.widget.RadioButton
import com.biglabs.solo.signer.library.Signer
import com.biglabs.solo.signer.library.SignerListener
import com.biglabs.solo.signer.library.models.Wallet
import com.biglabs.solo.wallet.fragments.ExchangeFragment
import com.biglabs.solo.wallet.fragments.ReceiveFragment
import com.biglabs.solo.wallet.fragments.SendFragment
import com.biglabs.solo.wallet.fragments.WalletFragment
import com.biglabs.solo.wallet.models.events.WalletInfoEventMessage
import com.biglabs.solo.wallet.models.WalletsViewModel
import com.biglabs.solo.wallet.models.events.WalletTransactionEventMessage
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.content_main.*
import org.greenrobot.eventbus.EventBus


class MainActivity : AppCompatActivity(), SignerListener {
    private var selectedTabId = -1
    private var fontNormal: Typeface? = null
    private var fontBold: Typeface? = null
    private lateinit var walletsViewModel: WalletsViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        initializeLayoutsParams()
        initializeEvents()
        loadCurrentTabFragment()

        walletsViewModel = ViewModelProviders.of(this).get(WalletsViewModel::class.java)
        Signer.initialize(this, this, BuildConfig.APPLICATION_ID)
    }

    private fun initializeLayoutsParams() {
        fontNormal = ResourcesCompat.getFont(this, R.font.utm_avo_regular)
        fontBold = ResourcesCompat.getFont(this, R.font.utm_avo_bold)

        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayShowTitleEnabled(false)
        supportActionBar?.setDisplayShowHomeEnabled(false)

        selectedTabId = action_nav_group.checkedRadioButtonId
        action_nav_group.findViewById<RadioButton>(selectedTabId)?.typeface = fontBold
    }

    private fun initializeEvents() {
        button_menu.setOnClickListener {
            if (!drawer_layout.isDrawerOpen(GravityCompat.END)) {
                drawer_layout.openDrawer(GravityCompat.END)
            }
        }

        action_nav_group.setOnCheckedChangeListener { group, checkedId ->
            group.findViewById<RadioButton>(selectedTabId)?.typeface = fontNormal
            group.findViewById<RadioButton>(checkedId)?.typeface = fontBold
            selectedTabId = checkedId
            loadCurrentTabFragment()
        }
    }

    private fun loadCurrentTabFragment() {
        var fragment: Fragment? = null
        when (selectedTabId) {
            R.id.action_nav_wallet -> fragment = WalletFragment.newInstance()
            R.id.action_nav_receive -> fragment = ReceiveFragment.newInstance()
            R.id.action_nav_exchange -> fragment = ExchangeFragment.newInstance()
            R.id.action_nav_send -> fragment = SendFragment.newInstance()
        }
        supportFragmentManager
                .beginTransaction()
                .replace(R.id.contain_main_frame, fragment)
                .commit()
    }

    override fun onSyncCompleted() {
        Signer.getInstance().getWallets(this)
    }

    override fun onReceiveWallets(wallets: List<Wallet>?) {
        // broadcast wallets to fragments
        walletsViewModel.updateWallets(wallets!!)
    }

    override fun onReceiveBalance(balance: String) {
        EventBus.getDefault().post(WalletInfoEventMessage(balance))
    }

    override fun onReceiveSignedTransaction(rawTx: String) {
        EventBus.getDefault().post(WalletTransactionEventMessage(rawTx))
    }

    override fun onReceiveSentTransaction(isSuccess: Boolean, txHash: String) {
        EventBus.getDefault().post(WalletTransactionEventMessage(isSuccess, txHash))
    }
}
