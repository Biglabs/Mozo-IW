package com.biglabs.solo.wallet.adapters

import android.annotation.SuppressLint
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.biglabs.solo.wallet.R
import com.biglabs.solo.wallet.models.CoinCheckable
import com.biglabs.solo.wallet.utils.RecyclerItemClickListener
import kotlinx.android.extensions.LayoutContainer
import kotlinx.android.synthetic.main.item_list_coin.*

class WalletsRecyclerAdapter(private val coins: List<CoinCheckable>, private val itemClickListener: RecyclerItemClickListener?) : RecyclerView.Adapter<WalletsRecyclerAdapter.WalletViewHolder>() {

    var selectedIndex = -1

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): WalletViewHolder =
            WalletViewHolder(LayoutInflater.from(parent.context).inflate(R.layout.item_list_coin, parent, false))

    override fun getItemCount(): Int {
        return coins.size
    }

    override fun onBindViewHolder(holder: WalletViewHolder, position: Int) {
        val coin = coins[position]
        if(coin.checked) selectedIndex = position
        holder.bind(coin)
        holder.itemView.setOnClickListener { itemClickListener?.onItemClicked(position) }
    }

    inner class WalletViewHolder(override val containerView: View?) : RecyclerView.ViewHolder(containerView), LayoutContainer {

        @SuppressLint("ResourceType")
        fun bind(coin: CoinCheckable) {
            item_coin_icon.setImageResource(coin.coin.icon)
            item_coin_name.text = coin.coin.key

            item_coin_activate_icon.visibility = if (coin.checked) View.VISIBLE else View.GONE
            item_coin_activate_text.visibility = if (coin.checked) View.VISIBLE else View.GONE
        }
    }
}