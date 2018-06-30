package com.biglabs.solo.wallet.utils

import android.app.Activity
import android.graphics.Color
import android.os.Build
import android.support.annotation.StringRes
import android.support.v4.app.Fragment
import android.view.View
import android.view.Window
import android.view.WindowManager
import android.widget.Toast
import androidx.core.widget.toast

private fun setWindowFlag(window: Window, bits: Int, on: Boolean) {
    val winParams = window.attributes
    if (on) {
        winParams.flags = winParams.flags or bits
    } else {
        winParams.flags = winParams.flags and bits.inv()
    }
    window.attributes = winParams
}

fun Activity.translucentStatusBar() {
    var uiFlags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
    if (Build.VERSION.SDK_INT >= 23) {
        uiFlags = uiFlags or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
    }
    window.decorView.systemUiVisibility = uiFlags

    if (Build.VERSION.SDK_INT >= 21) {
        setWindowFlag(window, WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS, true)
        setWindowFlag(window, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, true)
        setWindowFlag(window, WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS, false)
        window.statusBarColor = Color.TRANSPARENT
    }
}


/**
 * Creates and shows a [Toast] with the given [message]
 *
 * @param duration Toast duration, defaults to [Toast.LENGTH_SHORT]
 */
fun Fragment.toast(message: CharSequence, duration: Int = Toast.LENGTH_SHORT): Toast {
    return context!!.toast(message, duration)
}

/**
 * Creates and shows a [Toast] with text from a resource
 *
 * @param resId Resource id of the string resource to use
 * @param duration Toast duration, defaults to [Toast.LENGTH_SHORT]
 */
fun Fragment.toast(@StringRes resId: Int, duration: Int = Toast.LENGTH_SHORT): Toast {
    return context!!.toast(resId, duration)
}