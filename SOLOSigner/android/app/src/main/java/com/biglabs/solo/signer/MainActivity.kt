package com.biglabs.solo.signer

import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.Window
import android.view.WindowManager
import com.facebook.react.ReactActivity

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        translucentStatusBar()
        super.onCreate(savedInstanceState)
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    override fun getMainComponentName(): String? {
        return "SOLOSigner"
    }

    private fun setWindowFlag(window: Window, bits: Int, on: Boolean) {
        val winParams = window.attributes
        if (on) {
            winParams.flags = winParams.flags or bits
        } else {
            winParams.flags = winParams.flags and bits.inv()
        }
        window.attributes = winParams
    }

    private fun translucentStatusBar() {
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
}
