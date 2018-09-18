
const userReference = require('electron-settings');
var request = require('request');

const oauth2 = require('./oauth2');
const ERRORS = require("../constants").ERRORS;

const app_config = require("../app_settings").APP_SETTINGS;
const mozo_service_host = app_config.mozo_services.api.host;


async function setRequestData() {
  let token_header = await oauth2.tokenHeader();
  if (!token_header) {
    return null;
  }
  let options = {
    url: mozo_service_host + "/api/user-profile",
    headers: {
      'Authorization' : token_header
    },
    method: 'GET'
  };
  return options;
}

function extractWalletData(walletInfo) {
  if (!walletInfo) {
    return;
  }

  if (!walletInfo.encryptSeedPhrase) {
    return;
  }

  let app_info = userReference.get("App");
  if (app_info &&
      app_info[0].mnemonic == walletInfo.encryptSeedPhrase) {
    return;
  }

  app_info = [
    {
      pin: null,
      mnemonic: walletInfo.encryptSeedPhrase
    }
  ];
  userReference.set("App", app_info);
}

async function getUserProfile(callback) {
  let options = await setRequestData();
  if (!options) {
    return;
  }
  var user_profile = null;

  await request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("User profile: " + body);
      user_profile = JSON.parse(body);
      if (user_profile.walletInfo) {
        extractWalletData(user_profile.walletInfo);
      }
      if (callback) {
        callback(user_profile);
      }
    } else {
      console.log(error);
    }
  });
  return user_profile;
}
getUserProfile(null);

exports.getUserProfile = getUserProfile;

exports.updateWalletInfo = async function() {
  const app_info = userReference.get("App");
  if (!app_info) {
    return;
  }
  let encrypted_mnemonic = app_info[0].mnemonic;

  let offchain_address = null;
  let wallet_addrs = userReference.get("Address");
  if (!wallet_addrs) {
    return;
  }

  for (var index = 0; index < wallet_addrs.length; ++index) {
    let addr = wallet_addrs[index];
    if (addr.network == "SOLO") {
      offchain_address = addr.address;
      break;
    }
  }

  if (!offchain_address) {
    return;
  }

  let options = await setRequestData();
  options.url = mozo_service_host + "/api/user-profile/wallet";
  options.method = "PUT";
  options.json = true;
  options.body = {
    encryptSeedPhrase : encrypted_mnemonic,
    offchainAddress : offchain_address
  };

  await request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("User profile: " + JSON.stringify(body));
    } else {
      console.log(error);
    }
  });

};

exports.createTransaction = async function(tx_info, res, callback) {
  let tx_req = {
    fees: 0,
    gasLimit: 0,
    gasPrice: 0,
    inputs: [
      {
        addresses: [ tx_info.from ]
      }
    ],
    outputs: [
      {
        addresses: [ tx_info.to ],
        value: tx_info.value
      }
    ]
  };

  let options = await setRequestData();
  options.url = mozo_service_host + "/api/eth/solo/txs";
  options.method = "POST";
  options.json = true;
  options.body = tx_req;

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body, res);
    } else {
      console.log(error);
      let response_data = {
        status: "ERROR",
        error: ERRORS.INTERNAL_ERROR
      };
      res.send({ result : response_data });
    }
  });

};

/**
 * Global variable for callback, work around in
 * waiting confirmation screen case
 * Currently can only handle 1 transaction at 1 time only
 */
var signHttpCallback = null;
var timerCountInterval = null;
var timerCount = 0;
var isFinishedConfirmationInput = false;

exports.confirmTransaction = async function(tx_server_req, res_callback) {
  if (signHttpCallback && timerCount > 0) {
    let response_data = {
      status: "ERROR",
      error: ERRORS.PENDING_TRANSACTION
    };
    res_callback({ result : response_data });
    return;
  }
  let request_data = {
    coinType: "SOLO",
    network: "SOLO",
    action: "SIGN",
    params: tx_server_req,
  };
  const main = require('../main');
  main.mainWindow.webContents.send('open-confirm-transaction-screen', request_data);
  signHttpCallback = res_callback;
  timerCount = 60; // number of seconds
  isFinishedConfirmationInput = false;

  // Add timer count
  timerCountInterval = setInterval(function() {
    if (timerCount > 0 && !isFinishedConfirmationInput) {
      timerCount -= 1;
    } else {
      clearInterval(timerCountInterval);
      timerCountInterval = null;
      let error_obj = {
        status: "ERROR",
        signedTransaction: null,
        error: {
          code: "ERR-012",
          title: "Transaction confirmation timeout",
          detail: "No transaction confirmation input from user.",
          type: "Business"
        }
      };
      sendSignRequest({result: error_obj});
    }
  }, 1000);

};

async function sendSignRequest(signed_req, callback) {
  let response_data = {
    status: "ERROR",
    error: ERRORS.CANCEL_REQUEST
  };

  if (signed_req.result.error) {
    if (signHttpCallback) {
      isFinishedConfirmationInput = true;
      signHttpCallback.send(response_data);
      signHttpCallback = null;
    }
    return;
  }

  let options = await setRequestData();
  options.url = mozo_service_host + "/api/eth/solo/txs/send-signed-tx";
  options.method = "POST";
  options.json = true;
  console.log(signed_req.result.signedTransaction);
  options.body = JSON.parse(signed_req.result.signedTransaction);

  request(options, function(error, response, body) {
    console.log(response.statusCode);
    console.log(body);
    if (!error && response.statusCode == 200) {
      console.log(body);
      signHttpCallback.send(body);
    } else {
      console.log(error);
      response_data.error = ERRORS.INTERNAL_ERROR;
      signHttpCallback.send(response_data);
    }
    isFinishedConfirmationInput = true;
    signHttpCallback = null;
  });
}

exports.sendSignRequest = sendSignRequest;
