package com.biglabs.solo.wallet

import android.annotation.SuppressLint
import android.arch.lifecycle.Observer
import android.arch.lifecycle.ViewModelProviders
import android.graphics.Typeface
import android.os.Bundle
import android.support.v4.app.Fragment
import android.support.v4.content.res.ResourcesCompat
import android.support.v4.view.GravityCompat
import android.support.v7.app.AppCompatActivity
import android.view.View
import android.widget.RadioButton
import com.biglabs.solo.signer.library.Signer
import com.biglabs.solo.signer.library.SignerListener
import com.biglabs.solo.signer.library.models.ui.TransactionHistory
import com.biglabs.solo.signer.library.models.ui.Wallet
import com.biglabs.solo.wallet.dialogs.WalletChooserDialog
import com.biglabs.solo.wallet.fragments.ExchangeFragment
import com.biglabs.solo.wallet.fragments.ReceiveFragment
import com.biglabs.solo.wallet.fragments.SendFragment
import com.biglabs.solo.wallet.fragments.WalletFragment
import com.biglabs.solo.wallet.models.WalletsViewModel
import com.biglabs.solo.wallet.models.events.ErrorMessage
import com.biglabs.solo.wallet.models.events.WalletInfoEventMessage
import com.biglabs.solo.wallet.models.events.WalletTransactionEventMessage
import com.biglabs.solo.wallet.utils.translucentStatusBar
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.content_main.*
import org.greenrobot.eventbus.EventBus
import java.math.BigDecimal

class MainActivity : AppCompatActivity(), SignerListener {
    private var selectedTabId = -1
    private var fontNormal: Typeface? = null
    private var fontBold: Typeface? = null
    private lateinit var walletsViewModel: WalletsViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        translucentStatusBar()
        setContentView(R.layout.activity_main)
        initializeLayoutsParams()
        initializeEvents()
        Signer.initialize(this, this, BuildConfig.APPLICATION_ID)

        walletsViewModel = ViewModelProviders.of(this).get(WalletsViewModel::class.java)
        walletsViewModel.getCurrentWallet().observe(this, Observer { onCurrentWalletChanged(it) })

        /* mock data */
//        walletsViewModel.updateWallets(WalletProvider.getWallet())

        loadCurrentTabFragment()
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
        button_choose_wallet.setOnClickListener {
            WalletChooserDialog.newInstance().show(supportFragmentManager, "WalletChooser")
        }
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

        fragment?.let {
            supportFragmentManager
                    .beginTransaction()
                    .replace(R.id.contain_main_frame, it)
                    .commit()
        }
    }

    @SuppressLint("ResourceType")
    private fun onCurrentWalletChanged(wallet: Wallet?) {
        wallet?.coin()?.let {
            button_choose_wallet.visibility = View.VISIBLE

            current_wallet_name.text = it.displayName
            current_wallet_icon.setImageResource(it.icon)
        }
    }

    override fun onSyncCompleted() {
        Signer.getInstance().getWallets(this)
    }

    override fun onReceiveWallets(wallets: List<Wallet>) {
        walletsViewModel.updateWallets(wallets)
    }

    override fun onReceiveBalance(balance: BigDecimal) {
        EventBus.getDefault().post(WalletInfoEventMessage(balance))
    }

    override fun onReceiveTransactionHistory(histories: List<TransactionHistory>) {
        EventBus.getDefault().post(histories)
    }

    override fun onReceiveSignTransactionResult(isSuccess: Boolean) {
        EventBus.getDefault().post(WalletTransactionEventMessage(isSuccess))
    }

    override fun onReceiveSentTransaction(isSuccess: Boolean, txHash: String?) {
        EventBus.getDefault().post(WalletTransactionEventMessage(true, isSuccess, txHash))
    }

    override fun onError(action: String, message: String?) {
        EventBus.getDefault().post(ErrorMessage(action, message))
    }
}
