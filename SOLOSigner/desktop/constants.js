
const CONSTANTS = {
  ADDRESS_BOOK : "AddressBook",
  CURRENCY_EXCHANGE_RATE : [ "USD", "KRW"],
  EXCHAGE_RATE_KEY : "ExchangeRate",
  IS_NEW_WALLET_KEY : "IsNewWallet",
  OAUTH2TOKEN_KEY : "OAuth2Token",
  OFFCHAIN_TOKEN_INFO : "OffchainTokenInfo"
};

exports.CONSTANTS = CONSTANTS;


const ERRORS = {
  CANCEL_REQUEST: {
    code: "ERR-002",
    title: "Cancel request",
    detail: "User cancelled the request.",
    type: "Business"
  },

  INVALID_REQUEST: {
    code: "ERR-095",
    title: "Invalid request",
    detail: "Not enough or incorrect parameters.",
    type: "Business"
  },

  NO_WALLET_NETWORK: {
    code: "ERR-096",
    title: "No network in request",
    detail: "No network in the request parameter.",
    type: "Business"
  },

  PENDING_TRANSACTION : {
    code: "ERR-097",
    title: "Pending transaction confirmation",
    detail: "Previous transaction has not been confirmed or cancelled.",
    type: "Business"
  },

  NO_WALLET : {
    code: "ERR-098",
    title: "No wallet",
    detail: "User has not logined",
    type: "Business"
  },

  INTERNAL_ERROR : {
    code: "ERR-099",
    title: "Internal error request",
    detail: "Internal error",
    type: "Infrastructure"
  }
};

exports.ERRORS = ERRORS;
