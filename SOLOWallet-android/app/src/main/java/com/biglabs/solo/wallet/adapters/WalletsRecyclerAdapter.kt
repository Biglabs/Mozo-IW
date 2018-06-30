package com.biglabs.solo.wallet.adapters

import android.annotation.SuppressLint
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import com.biglabs.solo.wallet.R
import com.biglabs.solo.wallet.utils.Coin


class WalletsRecyclerAdapter : RecyclerView.Adapter<WalletsRecyclerAdapter.WalletViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): WalletViewHolder =
            WalletViewHolder(LayoutInflater.from(parent.context).inflate(R.layout.item_list_coin, parent, false))

    override fun getItemCount(): Int {
        return Coin.values().size
    }

    override fun onBindViewHolder(holder: WalletViewHolder, position: Int) {
        holder.bind(Coin.values()[position])
    }

    inner class WalletViewHolder(view: View) : RecyclerView.ViewHolder(view) {

        val icon: ImageView = view.findViewById(R.id.item_coin_icon)
        val name: TextView = view.findViewById(R.id.item_coin_name)

        @SuppressLint("ResourceType")
        fun bind(coin: Coin) {
            icon.setImageResource(coin.icon)
            name.text = coin.name
        }
    }
}