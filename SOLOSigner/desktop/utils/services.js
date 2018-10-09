
const userReference = require('electron-settings');
const R = require('ramda');
var request = require('request');

const main = require('../main');
const ERRORS = require("../constants").ERRORS;
const CONSTANTS = require("../constants").CONSTANTS;
const oauth2 = require('./oauth2');
const {setRequestData} = require('./common');
var address_book = require('./addressbook');

const app_config = require("../app_settings").APP_SETTINGS;
const mozo_service_host = app_config.mozo_services.api.host;


function setIntervalImmediately(func, timer) {
  func();
  return setInterval(func, timer);
}

function extractWalletData(walletInfo) {
  if (!walletInfo || !walletInfo.encryptSeedPhrase) {
    userReference.set(
      CONSTANTS.IS_NEW_WALLET_KEY,
      "true"
    );
    return;
  }

  if (userReference.get(CONSTANTS.IS_NEW_WALLET_KEY)) {
    // If we have wallets from the server,
    // and NEW wallets from local, we will delete all from local
    // and use the info from the server
    userReference.delete(CONSTANTS.IS_NEW_WALLET_KEY);
    userReference.delete("@DbExisting:key");
    userReference.delete("App");
    userReference.delete("Address");
    main.mainWindow.loadURL(`file://${__dirname}/../index.html`);
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

function getExchangeRateInfo() {
  let options = setRequestData();
  if (!options) {
    return;
  }

  let network_name = "SOLO";

  for (var index = 0; index < CONSTANTS.CURRENCY_EXCHANGE_RATE.length; ++index) {
    let exchange_rate_name = network_name + "_" +
        CONSTANTS.CURRENCY_EXCHANGE_RATE[index];
    options.url = mozo_service_host +
      "/api/exchange/rate?currency=" + CONSTANTS.CURRENCY_EXCHANGE_RATE[index] +
      "&symbol=" + network_name;

    request(options, function(error, response, body) {
      if (!error) {
        console.log(body);
        if (response.statusCode == 200) {
          exchange_info = JSON.parse(body);
          userReference.set(exchange_rate_name, exchange_info);
        } else {
          console.log(response.statusCode);
          console.log(body);
        }
      } else {
        console.log(error);
      }
    });

  }
}

let exchange_rate_interval = null;

function getUserProfile() {
  return new Promise(function(resolve, reject) {
    let options = setRequestData();
    if (!options) {
      return;
    }

    request(options, function(error, response, body) {
      if (!error) {
        if (response.statusCode == 200) {
          // console.log("User profile: " + body);
          user_profile = JSON.parse(body);
          extractWalletData(user_profile.walletInfo);
          getOffchainTokenInfo();
          address_book.download();
          if (!exchange_rate_interval) {
            // Get exchange every 10 minutes
            exchange_rate_interval = setIntervalImmediately(
              getExchangeRateInfo, 600000);
          }
          resolve(null);
        } else if (response.statusCode == 401)  {
          userReference.deleteAll();
        } else {
          console.log(response.statusCode);
          console.log(body);
          reject(body);
        }
      } else {
        console.log(error);
        reject(error);
      }
    });
  });
}
getUserProfile().then(function() {}, function() {});

exports.getUserProfile = getUserProfile;

var logOut = exports.logOut = function() {
  userReference.deleteAll();
  if (exchange_rate_interval) {
    clearInterval(exchange_rate_interval);
    exchange_rate_interval = null;
  }
  var sess = main.mainWindow.webContents.session;
  sess.clearCache(function() {
    sess.clearStorageData();
    main.mainWindow.loadURL(`file://${__dirname}/../index.html`);
  });
}


let send_wallet_info_interval = null;

function cleanUpUpdateWalletInfoInverval() {
  clearInterval(send_wallet_info_interval);
  send_wallet_info_interval = null;
}

exports.updateWalletInfo = function() {
  return new Promise(function(resolve, reject) {
    if (!!send_wallet_info_interval) {
      resolve(null);
      return;
    }
    send_wallet_info_interval = setIntervalImmediately(function() {
      getUserProfile().then(function() {
        const is_new_wallet = userReference.get(CONSTANTS.IS_NEW_WALLET_KEY);
        if (!is_new_wallet) {
          resolve(null);
          cleanUpUpdateWalletInfoInverval();
          return;
        }

        const app_info = userReference.get("App");
        if (!app_info) {
          resolve(null);
          cleanUpUpdateWalletInfoInverval();
          return;
        }

        let encrypted_mnemonic = app_info[0].mnemonic;
        let offchain_address = null;
        let wallet_addrs = userReference.get("Address");
        if (!wallet_addrs) {
          resolve(null);
          cleanUpUpdateWalletInfoInverval();
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
          // The addresses and keys are not initilized correctly
          // We need to delete all and reset to login view
          cleanUpUpdateWalletInfoInverval();
          logOut();
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
            resolve(body);
            clearInterval(send_wallet_info_interval);
            send_wallet_info_interval = null;
          } else {
            console.log(error);
          }
        });
      }, function(err) {});
    }, 2000);
  }, function(err) {});

};

function getTokenInfo() {
  return userReference.get(CONSTANTS.OFFCHAIN_TOKEN_INFO);
};

exports.createTransaction = function(tx_info, res) {
  let tx_req = {
    gas_price : 0,
    gas_limit : 4300000,
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

exports.getWalletBalance = function(network_data) {
  return new Promise(function(resolve, reject) {
    if (!network_data) {
      reject(null);
      return;
    }

    let network = network_data.toUpperCase();
    let wallet_addrs = userReference.get("Address");
    let response_data = {
      status: "ERROR",
      error: ERRORS.NO_WALLET
    };

    if (!wallet_addrs) {
      reject(null);
      return;
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
      reject(null);
      return;
    }

    let options = setRequestData();
    if (!options) {
      reject(null);
      return;
    }

    options.url = mozo_service_host +
      "/api/solo/contract/solo-token/balance/" + address;


    request(options, function(error, response, body) {
      if (!error) {
        if (response.statusCode == 200) {
          console.log("Balance Info: " + body);
          balance_info = JSON.parse(body);
          if (balance_info.decimals && balance_info.decimals > 0) {
            balance_info.balance /= Math.pow(10, balance_info.decimals);
          }
          let exchange_rates = R.map(x => {
            let exchange_rate_data = userReference.get(network + "_" + x);
            if (exchange_rate_data) {
              return {
                currency : exchange_rate_data.currency,
                value: balance_info.balance * exchange_rate_data.rate
              };
            }
          }, CONSTANTS.CURRENCY_EXCHANGE_RATE);
          balance_info.exchange_rates = exchange_rates;
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

exports.getTransactionHistory = function(network, page_num, size_num) {
  return new Promise(function(resolve, reject) {
    let wallet_addrs = userReference.get("Address");
    let response_data = {
      status: "ERROR",
      error: ERRORS.NO_WALLET
    };

    if (!wallet_addrs) {
      resolve(null);
      return;
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
      resolve(null);
      return;
    }

    let options = setRequestData();
    if (!options) {
      resolve(null);
      return;
    }

    options.url = mozo_service_host +
      "/api/solo/contract/solo-token/txhistory/" + address +
      "?page=" + page_num + "&size=" + size_num;

    request(options, function(error, response, body) {
      if (!error) {
        if (response.statusCode == 200) {
          let txhistory = JSON.parse(body);
          txhistory = R.map(x => {
            if (x.decimal) {
              x.amount /= Math.pow(10, x.decimal);
            }
            x.exchange_rates = R.map(y => {
              let exchange_rate_data = userReference.get(network + "_" + y);
              if (exchange_rate_data) {
                return {
                  currency : exchange_rate_data.currency,
                  value: x.amount * exchange_rate_data.rate
                };
              }
            }, CONSTANTS.CURRENCY_EXCHANGE_RATE);
            return x;
          }, txhistory);
          resolve(txhistory);
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

exports.getTxHashStatus = function(txhash) {
  return new Promise(function(resolve, reject) {
    if (!txhash) {
      return;
    }

    let options = setRequestData();
    options.url = mozo_service_host + "/api/eth/solo/txs/" + txhash + "/status";

    request(options, function(error, response, body) {
      if (!error) {
        let body_parsed = JSON.parse(body);
        if (response.statusCode == 200) {
          resolve(body_parsed);
        } else {
          console.log(response.statusCode);
          console.log(body);
          reject(body_parsed);
        }
      } else {
        console.log(error);
        reject(error);
      }
    });
  });
};

