package com.biglabs.solo.signer.library.utils

class CoinUtils {
    companion object {
        private fun btcToSatoshi(btc: Double) = btc * 1E+8
        private fun satoshiToBtc(satoshi: Double) = satoshi / 1E+8

        private fun ethToWei(eth: Double) = eth * 1E+18
        private fun weiToEth(wei: Double) = wei / 1E+18

        fun convertToServerUnit(coin: String, value: Double) =
                when (coin) {
                    CoinEnum.BTC.key -> btcToSatoshi(value)
                    CoinEnum.ETH.key -> ethToWei(value)
                    else -> value
                }

        fun convertToUIUnit(coin: String, value: Double) =
                when (coin) {
                    CoinEnum.BTC.key -> satoshiToBtc(value)
                    CoinEnum.ETH.key -> weiToEth(value)
                    else -> value
                }
    }
}