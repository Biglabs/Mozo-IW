package com.biglabs.solo.wallet.fragments

import android.arch.lifecycle.Observer
import android.arch.lifecycle.ViewModelProviders
import android.content.Intent
import android.os.Bundle
import android.support.v4.app.Fragment
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.biglabs.solo.signer.library.Signer
import com.biglabs.solo.signer.library.models.ui.Wallet
import com.biglabs.solo.wallet.R
import com.biglabs.solo.wallet.models.WalletsViewModel
import com.biglabs.solo.wallet.models.events.WalletTransactionEventMessage
import com.biglabs.solo.wallet.utils.toast
import com.google.zxing.integration.android.IntentIntegrator
import kotlinx.android.synthetic.main.fragment_nav_send.*
import org.greenrobot.eventbus.EventBus
import org.greenrobot.eventbus.Subscribe
import org.greenrobot.eventbus.ThreadMode


class SendFragment : Fragment() {

    var value = "0.005"
    private var transactionData: String? = null
    private var wallet: Wallet? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            // read params here
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_nav_send, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val walletsViewModel = ViewModelProviders.of(activity!!).get(WalletsViewModel::class.java)
        walletsViewModel.getCurrentWallet().observe(this, Observer { this.wallet = it })

        input_amount.setText(value)
        input_amount.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(p0: Editable?) {
                value = p0?.toString()!!
                updateUI()
            }

            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }
        })

        button_scan_address.setOnClickListener {
            IntentIntegrator.forSupportFragment(this).initiateScan()
        }

        buttonSend.setOnClickListener {
            val address = wallet?.address
            if (address != null) {
                val valueInNumber = value.toFloatOrNull()
                if (valueInNumber == null || valueInNumber == 0f || input_receive_address.length() == 0) {
                    toast("Invalid value")
                } else {
                    Signer.getInstance().confirmTransaction(
                            context!!,
                            address,
                            input_receive_address.text.toString(),
                            wallet?.coin()?.key!!,
                            wallet?.coin()?.network!!,
                            value, message_input.text.toString()
                    )
                }
            } else {
                toast("Please choose an account!")
            }
        }

        buttonSubmit.setOnClickListener {
            if (transactionData != null) {
                Signer.getInstance().sendTransaction(transactionData!!)
                transactionData = null
                updateUI()
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

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        val result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data)
        if (result?.contents != null) {
            input_receive_address.setText(result.contents)
        } else {
            super.onActivityResult(requestCode, resultCode, data)
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    fun onReceiveTransactionInfo(transaction: WalletTransactionEventMessage) {
        if (transaction.isSuccess != null && transaction.isSuccess!!) {
            text_output.text = "send transaction: ${if (transaction.isSuccess!!) "successfully" else "failed"} \n txHash: ${transaction.txHash}"
        } else {
            transactionData = transaction.rawTx
            text_output.text = "signed transaction: $transaction.rawTx"
            updateUI()
        }
    }

    fun updateUI() {
        buttonSubmit.visibility = if (transactionData == null) View.GONE else View.VISIBLE
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment SendFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance() =
                SendFragment().apply {
                    arguments = Bundle().apply {
                        // put params here
                    }
                }
    }
}
