package com.biglabs.solo.wallet

import android.content.Intent
import android.os.Bundle
import android.support.v4.view.GravityCompat
import android.support.v7.app.AppCompatActivity
import android.text.Editable
import android.text.TextUtils
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.Toast
import com.biglabs.solo.signer.library.Signer
import com.biglabs.solo.signer.library.SignerListener
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.fragment_tab_send.*
import org.json.JSONObject

class MainActivity : AppCompatActivity() {

    val accounts = arrayOf("0x011df24265841dCdbf2e60984BB94007b0C1d76A", "0x213DE50319F5954D821F704d46e4fd50Fb09B459")
    var value = "0.5"

    private var transactionData: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Signer.initialize(this, BuildConfig.APPLICATION_ID)
        setContentView(R.layout.activity_main)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayShowTitleEnabled(false)
        supportActionBar?.setDisplayShowHomeEnabled(false)

        button_menu.setOnClickListener {
            if (!drawer_layout.isDrawerOpen(GravityCompat.END)) {
                drawer_layout.openDrawer(GravityCompat.END)
            }
        }

        radios.setOnCheckedChangeListener { _, checkedId ->
            run {
                Log.e("VU", "$checkedId")

                updateUI()
            }
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
                Signer.getInstance().getBalance(accounts[radios.checkedRadioButtonId - 1], object : SignerListener() {
                    override fun onReceivedBalance(p0: String?) {
                        textBalance.text = p0
                    }
                })
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
                    Signer.getInstance().confirmTransaction(accounts[from], accounts[to], "ETH", value, message_input.text.toString())
                }
            } else {
                Toast.makeText(this, "Please choose an account!", Toast.LENGTH_LONG).show()
            }
        }

        buttonSubmit.setOnClickListener {
            if (transactionData != null) {
                Signer.getInstance().sendTransaction(transactionData, object : SignerListener() {
                    override fun onTransactionSent(isSuccess: Boolean, txHash: String?) {
                        textBalance.text = "send transaction: ${if(isSuccess) "successfully" else "failed"} \n txHash: $txHash"
                    }
                })
                transactionData = null
                buttonSubmit.visibility = View.GONE
            }
        }
    }

    fun updateUI() {
        buttonSubmit.visibility = View.GONE
    }
}
