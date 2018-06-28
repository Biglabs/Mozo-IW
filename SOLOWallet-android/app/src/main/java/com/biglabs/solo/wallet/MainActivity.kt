package com.biglabs.solo.wallet

import android.os.Bundle
import android.support.v4.view.GravityCompat
import android.support.v7.app.AppCompatActivity
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.Toast
import com.biglabs.solo.signer.library.Signer
import com.biglabs.solo.signer.library.SignerListener
import com.biglabs.solo.signer.library.models.Wallet
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.fragment_tab_send.*

class MainActivity : AppCompatActivity(), SignerListener {

    private val accounts = arrayOf("0x011df24265841dCdbf2e60984BB94007b0C1d76A", "0x213DE50319F5954D821F704d46e4fd50Fb09B459")
    var value = "0.005"

    private var transactionData: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayShowTitleEnabled(false)
        supportActionBar?.setDisplayShowHomeEnabled(false)

        button_menu.setOnClickListener {
            if (!drawer_layout.isDrawerOpen(GravityCompat.END)) {
                drawer_layout.openDrawer(GravityCompat.END)
            }
        }

        radios.setOnCheckedChangeListener { _, _ ->
            updateUI()
        }

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

        buttonGetBalance.setOnClickListener {
            if (radios.checkedRadioButtonId > 0 && radios.checkedRadioButtonId <= accounts.size) {
                Signer.getInstance().getBalance(accounts[radios.checkedRadioButtonId - 1])
            } else {
                Toast.makeText(this, "Please choose an account!", Toast.LENGTH_LONG).show()
            }
        }

        buttonSend.setOnClickListener {
            if (radios.checkedRadioButtonId > 0 && radios.checkedRadioButtonId <= accounts.size) {
                val valueInNumber = value.toFloatOrNull()
                if (valueInNumber == null || valueInNumber == 0f) {
                    Toast.makeText(this, "Invalid value", Toast.LENGTH_LONG).show()
                } else {

                    val from = radios.checkedRadioButtonId - 1
                    val to = accounts.size - from - 1
                    Signer.getInstance().confirmTransaction(this, accounts[from], accounts[to], "ETH", value, message_input.text.toString())
                }
            } else {
                Toast.makeText(this, "Please choose an account!", Toast.LENGTH_LONG).show()
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
        Signer.initialize(this, BuildConfig.APPLICATION_ID)
    }

    override fun onReceiveHandshake(walletID: String) {
        textBalance.text = "walletID: $walletID"
        Log.e("vu", "walletID: $walletID")
        Signer.getInstance().getWallets(this)
    }

    override fun onReceiveWallets(wallets: List<Wallet>?) {
        Log.e("vu", "list : ${Gson().toJson(wallets)}")
        textBalance.text = "list wallets: ${Gson().toJson(wallets)}"
    }

    override fun onReceiveBalance(balance: String) {
        textBalance.text = balance
    }

    override fun onReceiveSentTransaction(isSuccess: Boolean, txHash: String) {
        textBalance.text = "send transaction: ${if (isSuccess) "successfully" else "failed"} \n txHash: $txHash"
    }

    override fun onReceiveSignedTransaction(signedTx: String) {
        transactionData = signedTx
        textBalance.text = "signed transaction: $transactionData"
        updateUI()
    }

    fun updateUI() {
        buttonSubmit.visibility = if (transactionData == null) View.GONE else View.VISIBLE
    }
}
