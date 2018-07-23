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

import com.biglabs.solo.wallet.R
import com.biglabs.solo.wallet.models.WalletsViewModel
import kotlinx.android.synthetic.main.fragment_nav_receive.*
import kotlinx.android.synthetic.main.layout_input_amount.*

class ReceiveFragment : Fragment() {

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

        val walletsViewModel = ViewModelProviders.of(activity!!).get(WalletsViewModel::class.java)
        walletsViewModel.getCurrentWallet().observe(this, Observer { updateUI(it) })
    }

    private fun updateUI(wallet: Wallet?) {
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
