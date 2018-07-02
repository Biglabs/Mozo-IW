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
import com.biglabs.solo.wallet.dialogs.QRCodeDialog
import com.biglabs.solo.wallet.models.WalletsViewModel
import com.biglabs.solo.wallet.models.events.WalletInfoEventMessage
import com.biglabs.solo.wallet.utils.copyToClipboard
import com.biglabs.solo.wallet.utils.toast
import com.google.zxing.BarcodeFormat
import com.journeyapps.barcodescanner.BarcodeEncoder
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

        button_copy_address.setOnClickListener {
            wallet?.address?.copyToClipboard("Wallet Address", context!!)
            toast(R.string.msg_copy_address)
        }

        button_get_balance.setOnClickListener {
            wallet?.let {
                Signer.getInstance().getBalance(it.address!!)
            }
        }

        image_address_qr_code.setOnClickListener {
            wallet?.address?.let{
                QRCodeDialog.newInstance(it).show(childFragmentManager, "ShowQRCode")
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
        wallet?.let {

            this.wallet = it

            text_address.text = it.address
            text_address_coin_type.text = it.coin()?.key

            try {
                val barcodeEncoder = BarcodeEncoder()
                val bitmap = barcodeEncoder.encodeBitmap(it.address, BarcodeFormat.QR_CODE, 200, 200)
                image_address_qr_code.setImageBitmap(bitmap)
            } catch (e: Exception) {

            }

            Signer.getInstance().getBalance(it.address!!)
        }
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
