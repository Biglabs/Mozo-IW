package com.biglabs.solo.wallet.fragments


import android.arch.lifecycle.LiveData
import android.arch.lifecycle.Observer
import android.arch.lifecycle.ViewModelProviders
import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.biglabs.solo.signer.library.Signer
import com.biglabs.solo.signer.library.models.ui.TransactionHistory
import com.biglabs.solo.signer.library.models.ui.Wallet
import com.biglabs.solo.signer.library.utils.Constants
import com.biglabs.solo.wallet.R
import com.biglabs.solo.wallet.adapters.TransactionHistoriesRecyclerAdapter
import com.biglabs.solo.wallet.dialogs.QRCodeDialog
import com.biglabs.solo.wallet.models.WalletsViewModel
import com.biglabs.solo.wallet.models.events.ErrorMessage
import com.biglabs.solo.wallet.utils.RecyclerEndlessScrollListener
import com.biglabs.solo.wallet.utils.copyToClipboard
import com.biglabs.solo.wallet.utils.displayString
import com.biglabs.solo.wallet.utils.toast
import com.google.zxing.BarcodeFormat
import com.journeyapps.barcodescanner.BarcodeEncoder
import kotlinx.android.synthetic.main.fragment_nav_wallet.*
import org.greenrobot.eventbus.EventBus
import org.greenrobot.eventbus.Subscribe
import org.greenrobot.eventbus.ThreadMode

class WalletFragment : Fragment() {

    private var wallet: Wallet? = null
    private var adapter: TransactionHistoriesRecyclerAdapter? = null
    private var histories = arrayListOf<TransactionHistory>()
    private var currentWalletLivaData: LiveData<Wallet>? = null
    private var isLoadMore = false
    private var isCanLoadMore = true

    private val currentWalletObserver = Observer<Wallet> { updateUI(it) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            // read params here
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? =
            inflater.inflate(R.layout.fragment_nav_wallet, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val walletsViewModel = ViewModelProviders.of(activity!!).get(WalletsViewModel::class.java)
        currentWalletLivaData = walletsViewModel.getCurrentWallet()

        initializeEvents()

        tx_history_recycler.run {
            addOnScrollListener(object : RecyclerEndlessScrollListener(layoutManager) {
                override fun onLoadMore() {
                    if (isLoadMore || !isCanLoadMore) return
                    wallet?.let {
                        isLoadMore = true
                        val lastBlockHeight = if (histories.isEmpty()) 0 else histories.last().blockHeight
                                ?: 0
                        Signer.getInstance().getTransactionHistory(it, lastBlockHeight)
                    }
                }
            })
        }
    }

    override fun onStart() {
        super.onStart()
        EventBus.getDefault().register(this)
    }

    override fun onResume() {
        super.onResume()
        currentWalletLivaData?.observe(this, currentWalletObserver)
        // TODO: check is not first launch todo something
    }

    override fun onPause() {
        super.onPause()
        currentWalletLivaData?.removeObserver { currentWalletObserver }
    }

    override fun onStop() {
        EventBus.getDefault().unregister(this)
        super.onStop()
    }

    private fun initializeEvents() {
        button_copy_address.setOnClickListener {
            wallet?.address?.copyToClipboard("Wallet Address", context!!)
            toast(R.string.msg_copy_address)
        }

        button_get_balance.setOnClickListener {
            wallet?.let {
                Signer.getInstance().getBalance(it)
            }
        }

        image_address_qr_code.setOnClickListener {
            wallet?.address?.let {
                QRCodeDialog.newInstance(it).show(childFragmentManager, "ShowQRCode")
            }
        }

        button_retry.setOnClickListener {
            Signer.getInstance().getWallets(activity!!)
        }

        refresh_layout.setOnRefreshListener {
            wallet?.let {
                Signer.getInstance().getTransactionHistory(it)
            }
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    fun onReceiveTransactionHistory(histories: List<TransactionHistory>) {
        refresh_layout.isRefreshing = false

        if (!isLoadMore) {
            this.histories.clear()
        }
        isLoadMore = false
        isCanLoadMore = histories.size >= Constants.API_ITEM_PER_PAGE

        this.histories.addAll(histories)
        adapter?.notifyData(isCanLoadMore)
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    fun onReceiveError(error: ErrorMessage) {
        progressBar.visibility = View.GONE

        when (error.action) {
            Signer.ACTION_GET_TX_HISTORY -> {
                refresh_layout.isRefreshing = false
                isLoadMore = false
                adapter?.notifyData(false)
            }
            Signer.ACTION_UNKNOWN -> {
                container_error.visibility = View.VISIBLE
                contain_container.visibility = View.GONE
            }
        }

        error.message?.let {
            toast(error.action + " " + it)
        }
    }

    private fun updateUI(wallet: Wallet?) {
        wallet?.let {
            this.wallet = it

            text_address.text = it.address
            text_address_coin_type.text = it.coin.key
            text_address_balance.text = it.balance.displayString(12)
            text_my_wallet.text = getString(R.string.text_my_wallet, it.coin.key.toUpperCase())

            try {
                val barcodeEncoder = BarcodeEncoder()
                val bitmap = barcodeEncoder.encodeBitmap(it.address, BarcodeFormat.QR_CODE, 200, 200)
                image_address_qr_code.setImageBitmap(bitmap)
            } catch (e: Exception) {
            }

            progressBar.visibility = View.GONE
            container_error.visibility = View.GONE
            contain_container.visibility = View.VISIBLE

            adapter = TransactionHistoriesRecyclerAdapter(it.coin.key, histories)
            tx_history_recycler.adapter = adapter

            this.histories.clear()
            adapter?.notifyDataSetChanged()

            if (it.balance == null) {
                Signer.getInstance().getBalance(it)
            }
            Signer.getInstance().getTransactionHistory(it)
        }
    }

    companion object {
        @JvmStatic
        fun newInstance() =
                WalletFragment().apply {
                    arguments = Bundle().apply {
                        // put params here
                    }
                }
    }
}
