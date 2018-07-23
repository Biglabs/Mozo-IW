package com.biglabs.solo.wallet.utils

import android.support.v7.widget.GridLayoutManager
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.RecyclerView

abstract class RecyclerEndlessScrollListener : RecyclerView.OnScrollListener {
    // The minimum number of items to have below your current scroll position
    // before loading more.
    private var visibleThreshold = 5
    // The current offset index of data you have loaded
    private var currentPage = 0
    // The total number of items in the dataset after the last load
    private var startingPageIndex = 0

    private var layoutManager: RecyclerView.LayoutManager

    private val lastVisibleItemPosition: Int
        get() = if (layoutManager is LinearLayoutManager) {
            (layoutManager as LinearLayoutManager).findLastVisibleItemPosition()
        } else {
            (layoutManager as GridLayoutManager).findLastVisibleItemPosition()
        }

    constructor(layoutManager: RecyclerView.LayoutManager) {
        this.layoutManager = layoutManager
    }

    constructor(layoutManager: LinearLayoutManager, visibleThreshold: Int) {
        this.layoutManager = layoutManager
        this.visibleThreshold = visibleThreshold

    }

    constructor(layoutManager: LinearLayoutManager, visibleThreshold: Int, startPage: Int) {
        this.layoutManager = layoutManager
        this.visibleThreshold = visibleThreshold
        this.startingPageIndex = startPage
        this.currentPage = startPage
    }

    // Defines the process for actually loading more data based on page
    abstract fun onLoadMore()

    override fun onScrollStateChanged(recyclerView: RecyclerView?, newState: Int) {
        super.onScrollStateChanged(recyclerView, newState)
        val totalItemCount = recyclerView!!.layoutManager.itemCount
        if (totalItemCount == lastVisibleItemPosition + visibleThreshold) {
            onLoadMore()
        }
    }
}