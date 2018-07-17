package com.biglabs.solo.signer.library.utils

import android.util.Log
import com.biglabs.solo.signer.library.BuildConfig

internal fun String.logAsError(prefix: String? = null) {
    if (BuildConfig.DEBUG) {
        Log.e("SignerSDK", (if (prefix != null) "$prefix: " else "") + this)
    }
}