package com.biglabs.solo.wallet.fragments


import android.arch.lifecycle.Observer
import android.arch.lifecycle.ViewModelProviders
import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import com.biglabs.solo.signer.library.models.ui.Wallet
import com.biglabs.solo.signer.library.utils.CoinUtils
import com.biglabs.solo.wallet.R
import com.biglabs.solo.wallet.dialogs.QRCodeDialog
import com.biglabs.solo.wallet.models.WalletsViewModel
import kotlinx.android.synthetic.main.fragment_nav_receive.*
import kotlinx.android.synthetic.main.layout_input_amount.*

class ReceiveFragment : Fragment() {

    private var wallet: Wallet? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            // read params here
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? =
            inflater.inflate(R.layout.fragment_nav_receive, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        input_amount.imeOptions = EditorInfo.IME_ACTION_DONE
        initializeEvents()

        ViewModelProviders.of(activity!!).get(WalletsViewModel::class.java).apply {
            getCurrentWallet().observe(this@ReceiveFragment, Observer { updateUI(it) })
        }
    }

    private fun initializeEvents() {
        buttonGenerate.setOnClickListener {
            wallet?.let {
                QRCodeDialog
                        .newInstance(
                                it.address!!,
                                CoinUtils.preparePaymentRequest(it.address!!, it.coin, input_amount.text.toString())
                        )
                        .show(childFragmentManager, "ShowQRCode")
            }
        }
    }

    private fun updateUI(wallet: Wallet?) {
        this.wallet = wallet
        wallet?.let {
            text_address.text = it.address
            input_amount_unit.text = it.coin.key
        }
    }

    companion object {
        @JvmStatic
        fun newInstance() =
                ReceiveFragment().apply {
                    arguments = Bundle().apply {
                        // put params here
                    }
                }
    }
}
