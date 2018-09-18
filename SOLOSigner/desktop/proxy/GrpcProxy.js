/**
 * format url for calling grpc from web
 * http://expressServer/packageName.serviceName/[METHOD NAME].
 * http://localhost:3000/service.Transaction/sign
 */

const grpc = require('grpc');

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


app.get('/oauth2-getcode', async (req, res, next) => {
  const code = req.query.code;
  const redirect_uri = "http://" + server_host + ":" + port + "/oauth2-getcode";
  const access_token = await oauth2.getTokenFromAuthCode(code, redirect_uri);
  if (access_token) {
    await services.getUserProfile(null);
  }
  main.mainWindow.loadURL(`file://${__dirname}/../index.html`);
  //res.send({ result : "SUCCESS" });
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
  }
  if (wallet) {
    let addr_network = req.query.network;
    response_data["error"]["detail"] = "No wallet address with `" +
      addr_network + "` network";

    for (var index = 0; index < wallet.length; ++index) {
      let wallet_obj = wallet[index];
      if (wallet_obj.network == addr_network) {
        response_data = {
          status: "SUCCESS",
          wallet_address: wallet_obj.address,
          error: {}
        };
        break;
      }
    }
  }
  res.send({ result : response_data });
});

app.get('/cleanUpWalletAddress', (req, res, next) => {
  userReference.deleteAll();
  res.send({ result : "SUCCESS" });
});

app.post('/transaction/send', async (req, res, next) => {
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
    if (addr.network == "SOLO") {
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

app.post('/transaction/sign', (req, res, next) => {
  grpcClient.sign(req.body, function(err, grpc_res) {
    if (err) {
      console.log(err);
      let signServiceProto = grpcLoader.sign_service_proto;
      let error_obj = {
        status: "ERROR",
        signedTransaction: null,
        error: {
          code: "ERR-099",
          title: "Internal error request",
          detail: "Internal error",
          type: "Infrastructure"
        }
      };
      res.send({result: error_obj});
    } else {
      res.send(grpc_res);
    }
  });
});

/**
 * export start proxy server to outside
 */
module.exports.start = function(){
  /**
   * forward rest call to grpc and vice versal
   */
  httpServer = app.listen(port, "0.0.0.0", async () => {
    console.log("Proxy is listening on port " + port + "!");
  });
};
