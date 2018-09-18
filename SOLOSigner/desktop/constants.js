
const CONSTANTS = {
  OAUTH2TOKEN_KEY : "OAuth2Token",
};

exports.CONSTANTS = CONSTANTS;


const ERRORS = {
  CANCEL_REQUEST: {
    code: "ERR-002",
    title: "Cancel request",
    detail: "User cancelled the request.",
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
