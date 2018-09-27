import { post, get } from "./requestManager"

async function CheckWallet() {
  return await get("checkwallet")
}

async function SendTransaction(data) {
  return await post("transaction/send", data)
}

async function GetAddressWallet(data) {
  return await get("getwalletaddress", data)
}

async function GetWalletBalance(data) {
  return await get("getwalletbalance", data)
}

export const Services = {
  checkWallet: CheckWallet,
  sendTransaction: SendTransaction,
  getAddressWallet: GetAddressWallet,
  getWalletBalance: GetWalletBalance
}