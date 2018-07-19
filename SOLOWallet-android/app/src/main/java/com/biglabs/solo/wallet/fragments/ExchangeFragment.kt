package com.biglabs.solo.wallet.fragments

import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

import com.biglabs.solo.wallet.R

class ExchangeFragment : Fragment() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            // read params here
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? =
            inflater.inflate(R.layout.fragment_nav_exchange, container, false)

    companion object {
        @JvmStatic
        fun newInstance() =
                ExchangeFragment().apply {
                    arguments = Bundle().apply {
                        // put params here

                    }
                }
    }
}
