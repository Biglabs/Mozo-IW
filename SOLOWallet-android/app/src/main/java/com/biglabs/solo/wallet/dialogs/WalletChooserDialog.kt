package com.biglabs.solo.wallet.dialogs

import android.app.Dialog
import android.arch.lifecycle.Observer
import android.arch.lifecycle.ViewModelProviders
import android.os.Bundle
import android.support.v7.app.AppCompatDialogFragment
import android.support.v7.widget.DefaultItemAnimator
import android.view.*
import com.biglabs.solo.signer.library.Signer
import com.biglabs.solo.signer.library.models.ui.Wallet
import com.biglabs.solo.wallet.R
import com.biglabs.solo.wallet.adapters.WalletsRecyclerAdapter
import com.biglabs.solo.wallet.models.CoinCheckable
import com.biglabs.solo.wallet.models.WalletsViewModel
import com.biglabs.solo.wallet.utils.RecyclerItemClickListener
import com.biglabs.solo.wallet.utils.fullscreenLayout
import kotlinx.android.synthetic.main.dialog_wallet_chooser.*

class WalletChooserDialog : AppCompatDialogFragment(), RecyclerItemClickListener {

    private var wallets = listOf<Wallet>()
    private val coins = arrayListOf<CoinCheckable>()
    private var adapter: WalletsRecyclerAdapter? = null
    private var walletsViewModel: WalletsViewModel? = null
    private var isUpdatingCurrentWallet = false

    companion object {
        @JvmStatic
        fun newInstance() = WalletChooserDialog()
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        val dialog = super.onCreateDialog(savedInstanceState)
        dialog.window?.let {
            it.attributes.windowAnimations = R.style.DialogUpDownAnimation
            it.attributes.gravity = Gravity.TOP
        }
        return dialog
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? =
            inflater.inflate(R.layout.dialog_wallet_chooser, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        adapter = WalletsRecyclerAdapter(coins, this)
        wallets_recycler.run {
            itemAnimator = DefaultItemAnimator()
            adapter = this@WalletChooserDialog.adapter
        }

        view.setOnClickListener { dismiss() }
        button_manage_wallet.setOnClickListener {
            context?.let {
                Signer.getInstance().manageWallet(it)
            }
        }

        walletsViewModel = ViewModelProviders.of(activity!!).get(WalletsViewModel::class.java).apply {
            getWallets().observe(this@WalletChooserDialog, Observer { onWalletsChanged(it) })
            getCurrentWallet().observe(this@WalletChooserDialog, Observer { onCurrentWalletChanged(it) })
        }
    }

    override fun onStart() {
        super.onStart()
        dialog?.fullscreenLayout()
    }

    private fun onCurrentWalletChanged(it: Wallet?) {
        it?.let {
            val coinCheckable = CoinCheckable(it.coin)
            if (this.coins.contains(coinCheckable)) {
                val selectedIndex = this.coins.indexOf(coinCheckable)
                this.coins[selectedIndex].run {
                    checked = true
                    walletIndex = selectedIndex
                }
                adapter?.notifyDataSetChanged()

                if (isUpdatingCurrentWallet) {
                    isUpdatingCurrentWallet = false
                    dismiss()
                }
            }
        }
    }

    private fun onWalletsChanged(it: List<Wallet>?) {
        this.wallets = it!!

        wallets.mapIndexed { index, wallet ->
            val coinCheckable = CoinCheckable(wallet.coin, index)
            if (!this.coins.contains(coinCheckable)) {
                this.coins.add(coinCheckable)
            } else {
                this.coins[this.coins.indexOf(coinCheckable)].checked = false
            }
        }

        adapter?.notifyDataSetChanged()
    }

    override fun onItemClicked(position: Int) {
        if (adapter?.selectedIndex!! >= 0) {
            this.coins[adapter?.selectedIndex!!].checked = false
        }
        val walletIndex = this.coins[position].walletIndex
        if (walletIndex >= 0) {
            isUpdatingCurrentWallet = true
            walletsViewModel?.updateCurrentWallet(wallets[walletIndex])
        }
    }
}