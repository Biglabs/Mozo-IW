package com.biglabs.solo.wallet.adapters

import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.biglabs.solo.signer.library.models.ui.TransactionHistory
import com.biglabs.solo.signer.library.utils.CoinUtils
import com.biglabs.solo.wallet.R
import kotlinx.android.extensions.LayoutContainer
import kotlinx.android.synthetic.main.item_list_transaction_history.*

class TransactionHistoriesRecyclerAdapter(private val coinType: String, private val histories: List<TransactionHistory>) : RecyclerView.Adapter<TransactionHistoriesRecyclerAdapter.TransactionHistoryViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = TransactionHistoryViewHolder(LayoutInflater.from(parent.context).inflate(R.layout.item_list_transaction_history, parent, false))

    override fun getItemCount() = histories.size

    override fun onBindViewHolder(holder: TransactionHistoryViewHolder, position: Int) {
        holder.bind(histories[position])
    }


    inner class TransactionHistoryViewHolder(override val containerView: View?) : RecyclerView.ViewHolder(containerView), LayoutContainer {

        fun bind(history: TransactionHistory) {
            text_history_date.text = history.time.toString()
            text_history_status.text = history.action
            text_history_transfer_amount.text = CoinUtils.convertToUIUnit(coinType, history.amount.toDouble()).toString()
        }
    }
}