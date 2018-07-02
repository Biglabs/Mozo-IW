package com.biglabs.solo.wallet.dialogs

import android.graphics.Bitmap
import android.os.AsyncTask
import android.os.Bundle
import android.support.v7.app.AppCompatDialogFragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.biglabs.solo.wallet.R
import com.google.zxing.BarcodeFormat
import com.journeyapps.barcodescanner.BarcodeEncoder
import kotlinx.android.synthetic.main.dialog_qr_code.*

class QRCodeDialog : AppCompatDialogFragment() {

    private var address: String? = null

    companion object {
        private const val KEY_ADDRESS: String = "KEY_ADDRESS"

        @JvmStatic
        fun newInstance(address: String) = QRCodeDialog().apply {
            arguments = Bundle().apply {
                // put params here
                putString(KEY_ADDRESS, address)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            this.address = it.getString(KEY_ADDRESS)
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? =
            inflater.inflate(R.layout.dialog_qr_code, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        dialog_qr_code_address.text = address
        EncodeQR {
            dialog_qr_code_image.setImageBitmap(it)
        }.execute(address)

        view.setOnClickListener { dismiss() }
    }

    override fun onStart() {
        super.onStart()
        dialog?.window?.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
    }

    class EncodeQR(private val handler: (bitmap: Bitmap) -> Unit) : AsyncTask<String, Void, Bitmap>() {
        override fun doInBackground(vararg params: String?): Bitmap? {
            return try {
                BarcodeEncoder().encodeBitmap(params[0], BarcodeFormat.QR_CODE, 512, 512)
            } catch (e: Exception) {
                null
            }
        }

        override fun onPostExecute(result: Bitmap?) {
            super.onPostExecute(result)
            result?.let {
                handler(it)
            }
        }
    }
}