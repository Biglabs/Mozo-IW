package com.biglabs.solo.wallet.utils

import android.support.annotation.StringRes
import android.support.v4.app.Fragment
import android.widget.Toast
import androidx.core.widget.toast

/**
 * Creates and shows a [Toast] with the given [message]
 *
 * @param duration Toast duration, defaults to [Toast.LENGTH_SHORT]
 */
inline fun Fragment.toast(message: CharSequence, duration: Int = Toast.LENGTH_SHORT): Toast {
    return context!!.toast(message, duration)
}

/**
 * Creates and shows a [Toast] with text from a resource
 *
 * @param resId Resource id of the string resource to use
 * @param duration Toast duration, defaults to [Toast.LENGTH_SHORT]
 */
inline fun Fragment.toast(@StringRes resId: Int, duration: Int = Toast.LENGTH_SHORT): Toast {
    return context!!.toast(resId, duration)
}