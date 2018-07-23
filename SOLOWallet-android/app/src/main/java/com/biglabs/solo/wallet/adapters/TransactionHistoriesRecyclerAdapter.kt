package com.biglabs.solo.wallet.adapters

import android.graphics.Typeface
import android.support.v4.content.ContextCompat
import android.support.v7.widget.RecyclerView
import android.text.Spannable
import android.text.SpannableString
import android.text.style.ForegroundColorSpan
import android.text.style.StyleSpan
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.biglabs.solo.signer.library.models.ui.TransactionHistory
import com.biglabs.solo.signer.library.utils.CoinUtils
import com.biglabs.solo.wallet.R
import com.biglabs.solo.wallet.utils.displayString
import kotlinx.android.extensions.LayoutContainer
import kotlinx.android.synthetic.main.item_list_transaction_history.*
import java.util.*

class TransactionHistoriesRecyclerAdapter(private val coinType: String, private val histories: List<TransactionHistory>) : RecyclerView.Adapter<TransactionHistoriesRecyclerAdapter.TransactionHistoryViewHolder>() {

    private val calendar = Calendar.getInstance()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = TransactionHistoryViewHolder(LayoutInflater.from(parent.context).inflate(R.layout.item_list_transaction_history, parent, false))

    override fun getItemCount() = histories.size

    override fun onBindViewHolder(holder: TransactionHistoryViewHolder, position: Int) {
        holder.bind(histories[position])
    }


    inner class TransactionHistoryViewHolder(override val containerView: View?) : RecyclerView.ViewHolder(containerView), LayoutContainer {

        private val unconfirmedColor = ContextCompat.getColor(containerView!!.context, R.color.colorError)

        fun bind(history: TransactionHistory) {
            calendar.timeInMillis = history.time

            text_history_time_day.text = calendar.get(Calendar.DAY_OF_MONTH).toString()
            text_history_time_month.text = calendar.getDisplayName(Calendar.MONTH, Calendar.SHORT, Locale.getDefault())

            val status = SpannableString(history.action?.toLowerCase()?.capitalize() + if (history.isConfirm) "" else " - unconfirmed")
            status.setSpan(ForegroundColorSpan(unconfirmedColor), history.action!!.length, status.length, Spannable.SPAN_INCLUSIVE_INCLUSIVE)
            status.setSpan(StyleSpan(Typeface.BOLD), 0, history.action!!.length, Spannable.SPAN_INCLUSIVE_INCLUSIVE)
            text_history_status.text = status

            val amount = CoinUtils.convertToUIUnit(coinType, history.amount).displayString()
            text_history_transfer_amount.text = String.format(Locale.US, "%s %s", amount, coinType.toUpperCase())
        }
    }
}