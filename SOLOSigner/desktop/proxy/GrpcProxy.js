/**
 * format url for calling grpc from web
 * http://expressServer/packageName.serviceName/[METHOD NAME].
 * http://localhost:3000/service.Transaction/sign
 */

const grpc = require('grpc');
const R = require('ramda');

const main = require('../main');
var grpcLoader = require("../grpcserver/GrpcLoader");
const app_config = require("../app_settings").APP_SETTINGS;
const ERRORS = require("../constants").ERRORS;

/**
 * create stub for client
 */
const grpcClient = new grpcLoader.sign_service_proto.Transaction(
    'localhost:50051', grpc.credentials.createInsecure()
);

/**
 * create a proxy using grpc-express to register rpc service as rest endpoint
 */
const express = require('express');
const app = express();

const server_host = app_config.proxy_server.host;
const port = app_config.proxy_server.port;
const public_host = app_config.proxy_server.public_host;

const mozo_service_host = app_config.mozo_services.api.host;

const userReference = require('electron-settings');
const oauth2 = require('../utils/oauth2');
const services = require('../utils/services');

let httpServer = null;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
             "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(express.json());


app.get('/oauth2-getcode', (req, res, next) => {
  const code = req.query.code;
  const redirect_uri = "http://" + server_host + ":" + port + "/oauth2-getcode";
  oauth2.getTokenFromAuthCode(code, redirect_uri).then(function(access_token) {
    if (access_token) {
      services.getUserProfile();
    }
    main.mainWindow.loadURL(`file://${__dirname}/../index.html`);
  }, function(err) {
    main.mainWindow.loadURL(`file://${__dirname}/../index.html`);
  });

});


app.get('/checkWallet', (req, res, next) => {
  let wallet = userReference.get("Address");
  let response_data = {
    status: "ERROR",
    error: ERRORS.NO_WALLET
  }
  if (wallet) {
    response_data = {
      status: "SUCCESS",
      error: {}
    }
  }
  res.send({ result : response_data });
});

app.get('/getWalletAddress', (req, res, next) => {
  let wallet = userReference.get("Address");
  let response_data = {
    status: "ERROR",
    error: ERRORS.NO_WALLET
  };

  if (!wallet) {
    res.send({ result : response_data });
    return;
  }

  let get_all_addresses = false;

  let addr_network = req.query.network;
  if (!addr_network) {
    get_all_addresses = true;
  } else {
    if ((typeof addr_network) == "string") {
      addr_network = [ addr_network ];
    }
    addr_network = addr_network.map(x => x.toUpperCase());
  }

  let wallet_arr = R.map(x => {
    return {
      network: x.network,
      address: x.address,
    }
  }, R.filter(x => addr_network.includes(x.network), wallet));

  console.log(JSON.stringify(wallet_arr));
  response_data = {
    status: "SUCCESS",
    data: wallet_arr,
    error: null
  };
  res.send({ result : response_data });
});

app.get('/getWalletBalance', (req, res, next) => {
  let response_data = {
    status: "ERROR",
    error: ERRORS.NO_WALLET
  };

  let addr_network = req.query.network;
  if (!addr_network) {
    response_data.error = ERRORS.NO_WALLET_NETWORK;
    res.send({ result : response_data });
    return;
  }
  let balance_info = services.getWalletBalance(addr_network).then(function(balance_info) {
    if (balance_info) {
      response_data = {
        status: "SUCCESS",
        data: balance_info,
        error: null
      };
    }
    res.send({ result : response_data });
  }, function(err) {
    res.send({ result : response_data });
  });
});

app.get('/getTxHistory', (req, res, next) => {
  let response_data = {
    status: "ERROR",
    error: ERRORS.NO_WALLET
  };

  let addr_network = req.query.network;
  if (!addr_network) {
    response_data.error = ERRORS.NO_WALLET_NETWORK;
    res.send({ result : response_data });
    return;
  }
  let balance_info = services.getTransactionHistory(addr_network).then(function(txhistory) {
    if (txhistory) {
      response_data = {
        status: "SUCCESS",
        data: txhistory,
        error: null
      };
    }
    res.send({ result : response_data });
  }, function(err) {
    res.send({ result : response_data });
  });
});

// app.get('/cleanUpWalletAddress', (req, res, next) => {
//   userReference.deleteAll();
//   res.send({ result : "SUCCESS" });
// });

var sjcl = require('../utils/sjcl');
var RNCryptor = require('../utils/rncryptor');

app.post('/test-data/encrypt', (req, res, next) => {
  let data = req.body.data;
  let password = req.body.password;
  console.log("Data: " + data);
  let encrypted_data = RNCryptor.Encrypt(
    password, sjcl.codec.utf8String.toBits(data));
  res.send( { data : encrypted_data } );
});

app.post('/test-data/decrypt', (req, res, next) => {
  let data = req.body.data;
  let password = req.body.password;
  try {
    let decrypted_data = RNCryptor.Decrypt(
      password, sjcl.codec.base64.toBits(data));
    res.send({ data : decrypted_data });
  } catch (e) {
    console.log(e);
    res.send({ data: "" });
  }
});

app.post('/transaction/send', (req, res, next) => {
  let tx_send_data = req.body;
  let wallet_addrs = userReference.get("Address");
  let response_data = {
    status: "ERROR",
    error: ERRORS.NO_WALLET
  };

  if (!wallet_addrs) {
    res.send({ result : response_data });
    return;
  }

  for (var index = 0; index < wallet_addrs.length; ++index) {
    let addr = wallet_addrs[index];
    // Currently support SOLO only
    if (addr.network == tx_send_data.network.toUpperCase()) {
      tx_send_data.from = addr.address;
      break;
    }
  }

  if (!tx_send_data.from) {
    res.send({ result : response_data });
    return;
  }

  services.createTransaction(tx_send_data, res, services.confirmTransaction);
});

/**
 * export start proxy server to outside
 */
module.exports.start = function(){
  /**
   * forward rest call to grpc and vice versal
   */
  httpServer = app.listen(port, public_host, async () => {
    console.log("Proxy is listening on host: " + public_host +
                " port: " + port + "!");
  });
};
