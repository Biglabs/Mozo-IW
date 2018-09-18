
const userReference = require('electron-settings');
var request = require('request');

const oauth2 = require('./oauth2');
const constants = require("../constants").CONSTANTS;

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

}
