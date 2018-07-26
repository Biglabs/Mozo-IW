package com.biglabs.solo.signer.library.utils

import java.math.BigDecimal

class CoinUtils {

    companion object {
        private val requestSplitRegex = "^\\w+\\W+|(\\?\\w+=)".toRegex()

        private fun btcToSatoshi(btc: Double) = btc * 1E+8
        private fun satoshiToBtc(satoshi: Double) = BigDecimal(satoshi / 1E+8)

        private fun ethToWei(eth: Double) = eth * 1E+18
        private fun weiToEth(wei: Double) = BigDecimal(wei / 1E+18)

        fun convertToServerUnit(coin: String, value: Double) =
                when (coin) {
                    CoinEnum.BTC.key -> btcToSatoshi(value)
                    CoinEnum.ETH.key -> ethToWei(value)
                    else -> value
                }

        fun convertToUIUnit(coin: String, value: Double): BigDecimal =
                when (coin) {
                    CoinEnum.BTC.key -> satoshiToBtc(value)
                    CoinEnum.ETH.key -> weiToEth(value)
                    else -> BigDecimal(value)
                }

        fun preparePaymentRequest(address: String, coin: CoinEnum, amount: String?): String {
            val builder = StringBuilder(coin.fullName)
            builder.append(":")
            builder.append(address)

            val amt = amount?.toBigDecimalOrNull()
            if (amt != null && amt.compareTo(BigDecimal.ZERO) == 1) {
                builder.append("?amount=")
                builder.append(amount)
            }
            return builder.toString()
        }

        fun parsePaymentRequest(request: String): List<String> {
            return request.split(requestSplitRegex).filter { !it.isEmpty() }.run {
                when {
                    this.size > 2 -> this.subList(0, 2)
                    this.size == 1 -> this.plus("")
                    this.isEmpty() -> arrayListOf("", "")
                    else -> this
                }
            }
        }
    }
}