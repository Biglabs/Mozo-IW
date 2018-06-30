package com.biglabs.solo.wallet.dialogs

import android.app.Dialog
import android.os.Bundle
import android.support.v7.app.AppCompatDialogFragment
import android.support.v7.widget.DefaultItemAnimator
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.biglabs.solo.wallet.R
import com.biglabs.solo.wallet.adapters.WalletsRecyclerAdapter
import com.biglabs.solo.wallet.utils.fullscreenLayout
import kotlinx.android.synthetic.main.dialog_wallet_chooser.*


class WalletChooserDialog : AppCompatDialogFragment() {

    companion object {
        @JvmStatic
        fun newInstance() = WalletChooserDialog()
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        val dialog = super.onCreateDialog(savedInstanceState)
        if (dialog.window != null) {
            val attributes = dialog.window.attributes
            attributes.windowAnimations = R.style.DialogUpDownAnimation
            attributes.gravity = Gravity.TOP
        }
        return dialog
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? =
            inflater.inflate(R.layout.dialog_wallet_chooser, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val adapter = WalletsRecyclerAdapter()
        wallets_recycler.itemAnimator = DefaultItemAnimator()
        wallets_recycler.adapter = adapter
    }

    override fun onStart() {
        super.onStart()
        dialog?.fullscreenLayout()
    }
}