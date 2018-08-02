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
import com.biglabs.solo.signer.library.utils.CoinUtils
import com.biglabs.solo.signer.library.utils.Constants
import com.biglabs.solo.wallet.R
import com.biglabs.solo.wallet.models.WalletsViewModel
import com.biglabs.solo.wallet.models.events.WalletTransactionEventMessage
import com.biglabs.solo.wallet.utils.displayString
import com.biglabs.solo.wallet.utils.toast
import com.google.zxing.integration.android.IntentIntegrator
import kotlinx.android.synthetic.main.fragment_nav_send.*
import kotlinx.android.synthetic.main.layout_input_amount.*
import org.greenrobot.eventbus.EventBus
import org.greenrobot.eventbus.Subscribe
import org.greenrobot.eventbus.ThreadMode
import java.math.BigDecimal
import java.util.*

class SendFragment : Fragment() {

    private var wallet: Wallet? = null
    private var isTxSigned = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            // read params here
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? =
            inflater.inflate(R.layout.fragment_nav_send, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        ViewModelProviders.of(activity!!).get(WalletsViewModel::class.java).apply {
            getCurrentWallet().observe(this@SendFragment, Observer { updateUI(it) })
        }

        input_amount.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(p0: Editable?) {
                updateTxUI()
            }

            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }
        })

        input_gas_limit.setText(Constants.GAS_LIMIT_EXTERNAL_ACCOUNT.toString())

        button_scan_address.setOnClickListener {
            IntentIntegrator.forSupportFragment(this).initiateScan()
        }

        buttonSend.setOnClickListener {
            if (isTxSigned) {
                Signer.getInstance().sendTransaction(wallet?.coin!!)
                isTxSigned = false
                updateTxUI()
            } else {
                val address = wallet?.address
                if (address != null) {
                    val amount = input_amount.text.toString().toBigDecimalOrNull()
                    if (amount != null && amount.compareTo(BigDecimal.ZERO) == 1 && input_receive_address.length() > 0) {
                        Signer.getInstance().createTransaction(
                                context!!,
                                address,
                                input_receive_address.text.toString(),
                                input_gas_limit.text.toString(),
                                wallet?.coin!!,
                                input_amount.text.toString(),
                                message_input.text.toString()
                        )
                    } else {
                        toast("Invalid value")
                    }
                } else {
                    toast("Please choose an account!")
                }
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
            val parsed = CoinUtils.parsePaymentRequest(result.contents)
            input_receive_address.setText(parsed[0])
            input_amount.setText(parsed[1])
        } else {
            super.onActivityResult(requestCode, resultCode, data)
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    fun onReceiveTransactionInfo(transaction: WalletTransactionEventMessage) {
        if (transaction.isSent) {
            text_output.text = "send transaction: ${if (transaction.isSent) "successfully" else "failed"} \n txHash: ${transaction.txHash}"
        } else {
            isTxSigned = transaction.isSigned
            updateTxUI()
        }
    }

    private fun updateUI(wallet: Wallet?) {
        wallet?.let {
            this.wallet = it
            input_amount_unit.text = it.coin.key
            input_amount_spendable.text = String.format(Locale.US, "%s %s", it.balance.displayString(12), it.coin.key.toUpperCase())

            if (it.balance == null) {
                Signer.getInstance().getBalance(it)
            }
        }
    }

    private fun updateTxUI() {
        buttonSend.setText(if (isTxSigned) R.string.common_text_send else R.string.text_button_confirm_transaction)
    }

    companion object {
        @JvmStatic
        fun newInstance() =
                SendFragment().apply {
                    arguments = Bundle().apply {
                        // put params here
                    }
                }
    }
}
