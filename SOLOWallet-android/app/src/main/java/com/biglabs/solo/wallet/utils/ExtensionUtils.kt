package com.biglabs.solo.wallet.utils

import android.app.Activity
import android.app.Dialog
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.graphics.drawable.InsetDrawable
import android.os.Build
import android.support.annotation.StringRes
import android.support.v4.app.Fragment
import android.view.View
import android.view.ViewGroup
import android.view.Window
import android.view.WindowManager
import android.widget.Toast
import androidx.core.widget.toast
import java.math.BigDecimal
import java.math.RoundingMode

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
    window.statusBarColor = Color.TRANSPARENT

    setWindowFlag(window, WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS, true)
    setWindowFlag(window, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, true)
    setWindowFlag(window, WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS, false)
}

fun Dialog.fullscreenLayout() {
    if (window == null) return

    var uiFlags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
    if (Build.VERSION.SDK_INT >= 23) {
        uiFlags = uiFlags or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
    }
    window.decorView.systemUiVisibility = uiFlags
    window.setBackgroundDrawable(InsetDrawable(ColorDrawable(Color.TRANSPARENT), 0))
    window.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)

    setWindowFlag(window, WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS, true)
    setWindowFlag(window, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, true)
    setWindowFlag(window, WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS, false)
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

/**
 *  Copy this String to Clipboard
 */
fun String.copyToClipboard(label: String, context: Context) {
    val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    clipboard.primaryClip = ClipData.newPlainText(label, this)
}

fun BigDecimal.trailingZeros(scale: Int): BigDecimal {
    return setScale(scale, RoundingMode.HALF_UP).stripTrailingZeros()
}

fun BigDecimal?.displayString(scale: Int = 6): String {
    return if (this == null) "0" else trailingZeros(scale).toPlainString()
}