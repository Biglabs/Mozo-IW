package com.biglabs.solo.wallet.fragments


import android.arch.lifecycle.Observer
import android.arch.lifecycle.ViewModelProviders
import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.biglabs.solo.signer.library.Signer
import com.biglabs.solo.signer.library.models.Wallet
import com.biglabs.solo.wallet.R
import com.biglabs.solo.wallet.models.events.WalletInfoEventMessage
import com.biglabs.solo.wallet.models.WalletsViewModel
import com.google.gson.Gson
import kotlinx.android.synthetic.main.fragment_nav_wallet.*
import org.greenrobot.eventbus.EventBus
import org.greenrobot.eventbus.Subscribe
import org.greenrobot.eventbus.ThreadMode

class WalletFragment : Fragment() {

    private var wallet: Wallet? = null

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
        walletsViewModel.getCurrentWallet().observe(this, Observer { updateUI(it) })

        buttonGetBalance.setOnClickListener {
            if (wallet != null) {
                Signer.getInstance().getBalance(wallet?.address!!)
            }
        }
    }

    override fun onStart() {
        super.onStart()
        EventBus.getDefault().register(this)
    }

    override fun onStop() {
        EventBus.getDefault().unregister(this)
        super.onStop()
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    fun onReceiveBalance(walletInfo: WalletInfoEventMessage) {
        text_address_balance.text = walletInfo.balance
    }

    private fun updateUI(wallet: Wallet?) {
        this.wallet = wallet

        text_address.text = wallet?.address
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment BlankFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance() =
                WalletFragment().apply {
                    arguments = Bundle().apply {
                        // put params here
                    }
                }
    }
}
