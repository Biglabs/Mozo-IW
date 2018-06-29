package com.biglabs.solo.wallet.fragments

import android.arch.lifecycle.Observer
import android.arch.lifecycle.ViewModelProviders
import android.os.Bundle
import android.support.v4.app.Fragment
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.biglabs.solo.signer.library.Signer
import com.biglabs.solo.signer.library.SignerListener
import com.biglabs.solo.signer.library.models.Wallet
import com.biglabs.solo.wallet.BuildConfig
import com.biglabs.solo.wallet.R
import com.biglabs.solo.wallet.models.WalletsViewModel
import com.biglabs.solo.wallet.models.events.WalletTransactionEventMessage
import com.biglabs.solo.wallet.utils.toast
import kotlinx.android.synthetic.main.fragment_nav_send.*
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

        value_input.setText(value)
        value_input.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(p0: Editable?) {
                value = p0?.toString()!!
                updateUI()
            }

            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }
        })

        buttonSend.setOnClickListener {
            val address = wallet?.address
            if (address != null) {
                val valueInNumber = value.toFloatOrNull()
                if (valueInNumber == null || valueInNumber == 0f) {
                    toast("Invalid value")
                } else {

                    val to = ""
                    Signer.getInstance().confirmTransaction(context!!, address, to, "ETH", value, message_input.text.toString())
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

    @Subscribe(threadMode = ThreadMode.MAIN)
    fun onReceiveTransactionInfo(transaction: WalletTransactionEventMessage) {
        if (transaction.isSuccess!!) {
            textBalance.text = "send transaction: ${if (transaction.isSuccess!!) "successfully" else "failed"} \n txHash: ${transaction.txHash}"
        } else {
            "signed transaction: $transaction.rawTx"
        }
    }

    fun updateUI() {
        buttonSubmit.visibility = if (transactionData == null) View.GONE else View.VISIBLE
    }

//    override fun onReceiveSentTransaction(isSuccess: Boolean, txHash: String) {
//        textBalance.text = "send transaction: ${if (isSuccess) "successfully" else "failed"} \n txHash: $txHash"
//    }
//
//    override fun onReceiveSignedTransaction(signedTx: String) {
//        transactionData = signedTx
//        textBalance.text = "signed transaction: $transactionData"
//        updateUI()
//    }

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
