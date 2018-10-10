/**
 * format url for calling grpc from web
 * http://expressServer/packageName.serviceName/[METHOD NAME].
 * http://localhost:3000/service.Transaction/sign
 */

//const grpc = require('grpc');
const R = require('ramda');

const main = require('../main');
// var grpcLoader = require("../grpcserver/GrpcLoader");
const app_config = require("../app_settings").APP_SETTINGS;
const CONSTANTS = require("../constants").CONSTANTS;
const ERRORS = require("../constants").ERRORS;

/**
 * create stub for client
 */
// const grpcClient = new grpcLoader.sign_service_proto.Transaction(
//     'localhost:50051', grpc.credentials.createInsecure()
// );

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
var address_book = require('../utils/addressbook');

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

app.get('/login', (req, res, next) => {
  let response_data = {
    status: "SUCCESS",
    data: null,
    error: null
  };
  if (!userReference.get(CONSTANTS.IS_NEW_WALLET_KEY) &&
      userReference.get("Address")) {
    res.send({ result : response_data });
    return;
  }

  let check_login_timeout = setInterval(function() {
    if (!userReference.get(CONSTANTS.IS_NEW_WALLET_KEY) &&
        userReference.get("Address")) {
      res.send({ result : response_data });
      clearInterval(check_login_timeout);
    }
  }, 1000);

});


app.get('/checkWallet', (req, res, next) => {
  let response_data = {
    status: "ERROR",
    error: ERRORS.NO_WALLET
  }

  let wallet = userReference.get("Address");
  let is_new_wallet = userReference.get(CONSTANTS.IS_NEW_WALLET_KEY);
  if (!is_new_wallet && wallet) {
    response_data = {
      status: "SUCCESS",
      data: null,
      error: null
    };
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

  // console.log(JSON.stringify(wallet_arr));
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
    response_data.error = ERRORS.INTERNAL_ERROR;
    res.send({ result : response_data });
  });
});

app.route('/address-book')
  .get((req, res, next) => {
    let response_data = {
      status : "SUCCESS",
      data : address_book.get(),
      error : null
    };
    res.send({ result : response_data});
  })
  .post((req, res, next) => {
    // console.log(req.body);
    let data = req.body;
    let response_data = {
      status: "ERROR",
      error: ERRORS.INTERNAL_ERROR
    };

    address_book.add(data).then(function(info) {
      response_data = {
        status: "SUCCESS",
        data: address_book.get(),
        error: null
      };
      res.send({result : response_data});
    }, function(err) {
      res.send({ result : response_data });
    });
  });

app.get('/address-book/find', (req, res, next) => {
  let response_data = {
    status : "SUCCESS",
    data: [],
    error: null
  };

  let keyword = req.query.keyword;
  if (!keyword) {
    res.send({result : response_data});
    return;
  }

  response_data.data = address_book.find(keyword);
  res.send({result : response_data});
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

  let page_num = req.query.page ? req.query.page : 1;
  let size_num = req.query.size ? req.query.size : 15;

  let balance_info = services.getTransactionHistory(
    addr_network, page_num, size_num).then(function(txhistory) {
    // console.log("TX history length: " + txhistory.length);
    if (txhistory) {
      response_data = {
        status: "SUCCESS",
        data: txhistory,
        error: null
      };
    }
    res.send({ result : response_data });
  }, function(err) {
    response_data.error = ERRORS.INTERNAL_ERROR;
    res.send({ result : response_data });
  });
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

app.get('/transaction/txstatus', (req, res, next) => {
  let txhash = req.query.txhash;
  let response_data = {
    status: "ERROR",
    error: ERRORS.INVALID_REQUEST
  };

  if (!txhash) {
    res.send({result : response_data});
    return;
  }

  services.getTxHashStatus(txhash).then(function(data) {
    response_data = {
      status: "SUCCESS",
      data: data,
      error: null
    };
    res.send({ result : response_data });
  }, function(err) {
    response_data.error = INTERNAL_ERROR;
    res.send({ result : response_data });
  });
});

/**
 * export start proxy server to outside
 */
module.exports.start = function(){
  /**
   * forward rest call to grpc and vice versal
   */
  httpServer = app.listen(port, public_host, async () => {
    // console.log("Proxy is listening on host: " + public_host +
                // " port: " + port + "!");
  });
  httpServer.setTimeout(500000);
};
