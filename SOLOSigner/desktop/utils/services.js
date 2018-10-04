
const userReference = require('electron-settings');
var request = require('request');

const main = require('../main');
const ERRORS = require("../constants").ERRORS;
const CONSTANTS = require("../constants").CONSTANTS;
const oauth2 = require('./oauth2');
const {setRequestData} = require('./common');
var address_book = require('./addressbook');

const app_config = require("../app_settings").APP_SETTINGS;
const mozo_service_host = app_config.mozo_services.api.host;


function extractWalletData(walletInfo) {
  if (!walletInfo || !walletInfo.encryptSeedPhrase) {
    userReference.set(
      CONSTANTS.IS_NEW_WALLET_KEY,
      "true"
    );
    return;
  }

  let app_info = userReference.get("App");
  if (app_info &&
      app_info[0].mnemonic == walletInfo.encryptSeedPhrase) {
    return;
  }

  let pin = null;
  if (app_info && app_info[0].pin) {
    pin = app_info[0].pin;
  }

  app_info = [
    {
      pin: pin,
      mnemonic: walletInfo.encryptSeedPhrase
    }
  ];
  userReference.set("App", app_info);

  if (userReference.get(CONSTANTS.IS_NEW_WALLET_KEY)) {
    userReference.delete(CONSTANTS.IS_NEW_WALLET_KEY);
  }
}

function getOffchainTokenInfo() {
  let options = setRequestData();
  if (!options) {
    return;
  }

  options.url = mozo_service_host +
    "/api/solo/contract/solo-token";

  request(options, function(error, response, body) {
    if (!error) {
      console.log(body);
      if (response.statusCode == 200) {
        token_info = JSON.parse(body);
        userReference.set(CONSTANTS.OFFCHAIN_TOKEN_INFO, token_info);
      } else {
        console.log(response.statusCode);
        console.log(body);
      }
    } else {
      console.log(error);
    }
  });
}

function getUserProfile() {
  let options = setRequestData();
  if (!options) {
    return;
  }

  request(options, function(error, response, body) {
    if (!error) {
      if (response.statusCode == 200) {
        // console.log("User profile: " + body);
        user_profile = JSON.parse(body);
        if (user_profile.walletInfo) {
          extractWalletData(user_profile.walletInfo);
        }
        getOffchainTokenInfo();
        address_book.download();
      } else if (response.statusCode == 401)  {
        userReference.deleteAll();
      } else {
        console.log(response.statusCode);
        console.log(body);
      }
    } else {
      console.log(error);
    }
  });
}
getUserProfile();

exports.getUserProfile = getUserProfile;

exports.logOut = function() {
  userReference.deleteAll();
  var sess = main.mainWindow.webContents.session;
  sess.clearCache(function() {
    sess.clearStorageData();
    main.mainWindow.loadURL(`file://${__dirname}/../index.html`);
  });
}

exports.updateWalletInfo = function() {
  const is_new_wallet = userReference.get(CONSTANTS.IS_NEW_WALLET_KEY);
  if (!is_new_wallet) {
    return;
  }

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
      userReference.delete(CONSTANTS.IS_NEW_WALLET_KEY);
      console.log("User profile: " + JSON.stringify(body));
    } else {
      console.log(error);
    }
  });

};

function getTokenInfo() {
  return userReference.get(CONSTANTS.OFFCHAIN_TOKEN_INFO);
};

exports.createTransaction = function(tx_info, res) {
  let tx_req = {
    inputs: [
      {
        addresses: [ tx_info.from ]
      }
    ],
    outputs: null
  };

  let options = setRequestData();
  options.url = mozo_service_host + "/api/solo/contract/solo-token/transfer";
  options.method = "POST";
  options.json = true;
  options.body = tx_req;

  console.log("Request data: " + JSON.stringify(options));
  const token_info = getTokenInfo();
  if (token_info) {
    console.log("Real value: " + tx_info.value * Math.pow(10, token_info.decimals));
    let outputs_tx = [
      {
        addresses: [ tx_info.to ],
        value: tx_info.value * Math.pow(10, token_info.decimals)
      }
    ];
    options.body.outputs = outputs_tx;

    request(options, function(error, response, body) {
      console.log(JSON.stringify(options));
      console.log(response.statusCode);
      if (!error) {
        if (response.statusCode == 200) {
          console.log("Transaction info: " + JSON.stringify(body));
          body.tx.outputs = outputs_tx;
          confirmTransaction(body, res);
        } else {
          console.log(response.statusCode);
          console.log(body);
          let response_data = {
            status: "ERROR",
            error: ERRORS.INTERNAL_ERROR
          };
          res.send({ result : response_data });
        }
      } else {
        console.log(error);
        let response_data = {
          status: "ERROR",
          error: ERRORS.INTERNAL_ERROR
        };
        res.send({ result : response_data });
      }
    });
  } else {
    let response_data = {
      status: "ERROR",
      error: ERRORS.INTERNAL_ERROR
    };
    res.send({ result : response_data });
  }
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
var previous_state = null;

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

  if (main.mainWindow.isMinimized()) {
    previous_state = "minimized";
  }
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
      if (previous_state && previous_state == "minimized") {
        previous_state = null;
        main.mainWindow.minimize();
      }
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
    if (!error) {
      console.log(JSON.stringify(body));
      if (response.statusCode == 200) {
        response_data = {
          status: "SUCCESS",
          data: body
        };
      } else {
        console.log(response.statusCode);
        response_data.error = ERRORS.INTERNAL_ERROR;
      }
    } else {
      console.log(error);
      response_data.error = ERRORS.INTERNAL_ERROR;
    }
    signHttpCallback.send({ result : response_data });
    isFinishedConfirmationInput = true;
    signHttpCallback = null;
    if (previous_state && previous_state == "minimized") {
      previous_state = null;
      main.mainWindow.minimize();
    }
  });
}

exports.sendSignRequest = sendSignRequest;

exports.getWalletBalance = function(network) {
  network = network.toUpperCase();
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
      if (!error) {
        if (response.statusCode == 200) {
          console.log("Balance Info: " + body);
          balance_info = JSON.parse(body);
          if (balance_info.decimals && balance_info.decimals > 0) {
            balance_info.balance /= Math.pow(10, token_info.decimals);
          }
          resolve(balance_info);
        } else {
          console.log(response.statusCode);
          console.log(body);
          resolve(null);
        }
      } else {
        console.log(error);
        reject(error);
      }
    });
  });
};

exports.getTransactionHistory = function(network) {
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
    "/api/solo/contract/solo-token/txhistory/" + address;

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (!error) {
        console.log(body);
        if (response.statusCode == 200) {
          txhistory = JSON.parse(body);
          resolve(txhistory);
        } else {
          console.log(response.statusCode);
          resolve(null);
        }
      } else {
        console.log(error);
        reject(error);
      }
    });
  });
};
