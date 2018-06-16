package com.big_labs.solo.wallet

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.text.Editable
import android.text.TextUtils
import android.text.TextWatcher
import android.util.Log
import android.widget.Toast
import com.big_labs.solo.signer.library.Signer
import com.big_labs.solo.signer.library.SignerListener
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    val accounts = arrayOf("0x011df24265841dCdbf2e60984BB94007b0C1d76A", "0x213DE50319F5954D821F704d46e4fd50Fb09B459")
    var value = "0.5"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        radios.setOnCheckedChangeListener { group, checkedId ->
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
                Signer.getInstance().getBalance(accounts[radios.checkedRadioButtonId], object : SignerListener() {
                    override fun onReceivedBalance(balance: String?) {
                        textBalance.text = balance
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
                    Signer.getInstance().sendTransaction(this, accounts[from], accounts[to], value, message_input.text.toString(), BuildConfig.APPLICATION_ID)
                }
            } else {
                Toast.makeText(this, "Please choose an account!", Toast.LENGTH_LONG).show()
            }
        }

        handleIntent(intent!!)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        handleIntent(intent!!)
    }

    private fun handleIntent(intent: Intent) {
        val scheme = "wallet-${BuildConfig.APPLICATION_ID}://"
        if (TextUtils.equals(intent.scheme, scheme) && intent.data != null) {
            textBalance.text = intent.dataString.replaceFirst(scheme, "")
        }
    }

    fun updateUI() {
        val from = radios.checkedRadioButtonId
        val to = accounts.size - from + 1
        buttonSend.text = "send $value ETH\nfrom Account $from to Account $to"
    }
}
