package com.biglabs.solo.signer.library

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.text.TextUtils
import android.util.Log
import android.view.View
import org.json.JSONObject

class SignerWrapperActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handleIntent(intent!!)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        handleIntent(intent!!)
    }

    private fun handleIntent(intent: Intent) {
        val scheme = "${BuildConfig.APPLICATION_ID}.solowallet"
        if (TextUtils.equals(intent.scheme, scheme) && intent.data != null) {
            try {
                val data = intent.dataString.split("://")[1]
                val jsonData = JSONObject(data)
                val action = jsonData.getString("action")
                when (action) {
                    Signer.ACTION_SIGN -> {
                    }
                }
            } catch (ex: Exception) {
            }
        }
    }
}