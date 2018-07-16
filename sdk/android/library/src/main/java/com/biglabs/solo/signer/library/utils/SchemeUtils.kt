package com.biglabs.solo.signer.library.utils

import android.content.Context
import android.content.Intent
import android.net.Uri
import com.biglabs.solo.signer.library.models.scheme.SignerRequest

internal class SchemeUtils {
    companion object {

        fun prepareSignerLink(data: SignerRequest): Uri {
            return Uri.parse(
                    StringBuilder(Constants.SIGNER_SCHEME)
                            .append("://")
                            .append(data.toString())
                            .toString()
            )
        }

        fun prepareWalletReceiveScheme(applicationId: String): String {
            return StringBuilder(applicationId)
                    .append(".")
                    .append(Constants.WALLET_SCHEME_SUFFIX)
                    .toString()
        }

        fun openLink(context: Context, uri: Uri): Boolean {
            val intent = Intent(Intent.ACTION_VIEW, uri)
            if (intent.resolveActivity(context.packageManager) != null) {
                intent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS)
                context.startActivity(intent)
                return true
            }
            return false
        }
    }
}