package com.biglabs.solo.signer.library

import android.app.Activity
import android.content.Intent
import android.os.Bundle

class SignerWrapperActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        onNewIntent(intent)
    }

    override fun onNewIntent(intent: Intent?) {
        if (intent != null && intent.data != null) {
            Signer.getInstance().handleScheme(intent)
        }
        finish()
    }
}