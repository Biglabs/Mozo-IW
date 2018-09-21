import { post, get } from "./requestManager"

async function CheckWallet() {
  return await get("checkwallet")
}

async function SendTransaction(data) {
  return await post("transaction/send", data)
}

export const Services = {
  checkWallet: CheckWallet,
  sendTransaction: SendTransaction
}