
const userReference = require('electron-settings');
var request = require('request');

const oauth2 = require('./oauth2');
const ERRORS = require("../constants").ERRORS;

const app_config = require("../app_settings").APP_SETTINGS;
const mozo_service_host = app_config.mozo_services.api.host;


function setRequestData() {
  let token_header = oauth2.tokenHeader();
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

function getUserProfile() {
  let options = setRequestData();
  if (!options) {
    return;
  }

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log("User profile: " + body);
      user_profile = JSON.parse(body);
      if (user_profile.walletInfo) {
        extractWalletData(user_profile.walletInfo);
      }
    } else {
      console.log(response.statusCode);
      console.log(body);
    }
  });
}
getUserProfile();

exports.getUserProfile = getUserProfile;

exports.updateWalletInfo = function() {
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

  let options = setRequestData();
  options.url = mozo_service_host + "/api/user-profile/wallet";
  options.method = "PUT";
  options.json = true;
  options.body = {
    encryptSeedPhrase : encrypted_mnemonic,
    offchainAddress : offchain_address
  };

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("User profile: " + JSON.stringify(body));
    } else {
      console.log(error);
    }
  });

};

exports.createTransaction = function(tx_info, res) {
  let tx_req = {
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

  let options = setRequestData();
  options.url = mozo_service_host + "/api/solo/contract/solo-token/transfer";
  options.method = "POST";
  options.json = true;
  options.body = tx_req;

  request(options, function(error, response, body) {
    console.log(body);
    console.log(response.statusCode);
    if (!error && response.statusCode == 200) {
      confirmTransaction(body, res);
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

function confirmTransaction(tx_server_req, res_callback) {
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

function sendSignRequest(signed_req, callback) {
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

  let options = setRequestData();
  options.url = mozo_service_host + "/api/solo/contract/solo-token/send-signed-tx";
  options.method = "POST";
  options.json = true;
  console.log(signed_req.result.signedTransaction);
  options.body = JSON.parse(signed_req.result.signedTransaction);

  request(options, function(error, response, body) {
    console.log(response.statusCode);
    console.log(body);
    if (!error && response.statusCode == 200) {
      console.log(body);
      response_data = {
        status: "SUCCESS",
        data: body
      };
    } else {
      console.log(error);
      response_data.error = ERRORS.INTERNAL_ERROR;
    }
    signHttpCallback.send({ result : response_data });
    isFinishedConfirmationInput = true;
    signHttpCallback = null;
  });
}

exports.sendSignRequest = sendSignRequest;

exports.getWalletBalance = function(network) {
  let wallet_addrs = userReference.get("Address");
  let response_data = {
    status: "ERROR",
    error: ERRORS.NO_WALLET
  };

  if (!wallet_addrs) {
    return null;
  }

  let address = null;

  for (var index = 0; index < wallet_addrs.length; ++index) {
    let addr = wallet_addrs[index];
    if (addr.network == network) {
      address = addr.address;
      break;
    }
  }

  if (!address) {
    return null;
  }

  let options = setRequestData();
  if (!options) {
    return null;
  }

  options.url = mozo_service_host +
    "/api/solo/contract/solo-token/balance/" + address;

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Balance Info: " + body);
        balance_info = JSON.parse(body);
        resolve(balance_info);
      } else {
        console.log(error);
        reject(error);
      }
    });
  });
}
