/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/**
 * Implements the sign RPC method.
 */
var grpc = require('grpc');
const grpcServer = new grpc.Server();
var grpcLoader = require("./GrpcLoader");
var signServiceProto = grpcLoader.sign_service_proto;

/**
 * Global variable for callback, work around in
 * waiting confirmation screen case
 * Currently can only handle 1 transaction at 1 time only
 */
var signHttpCallback = null;

var timerCountInterval = null;
var timerCount = 0;
var isFinishedConfirmationInput = false;

function sign(call, callback) {
  // Return error message if we still waiting for the confirmation from
  // previous transaction
  if (signHttpCallback && timerCount > 0) {
    let error_obj = {
      status: "ERROR",
      signedTransaction: null,
      error: {
        code: "ERR-011",
        title: "Pending transaction confirmation",
        detail: "Previous transaction has not been confirmed or cancelled.",
        type: "Business"
      }
    };
    callback(null, {result: error_obj});
    return;
  }

  let request_data = call.request;
  request_data.action = "SIGN";
  const main = require('../main');
  main.mainWindow.webContents.send('open-confirm-transaction-screen', request_data);
  //require('electron').remote.getCurrentWindow().webContents.send('ping', 5);
  signHttpCallback = callback;
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
      returnSignRequest({result: error_obj});
    }
  }, 1000);
}

function returnSignRequest(req) {
  let result_data = {
    result: req.result
  };

  if (req.result.error) {
    result_data.result.status = "ERROR";
  } else {
    result_data.result.status = "SUCESS";
  }
  if (signHttpCallback) {
    isFinishedConfirmationInput = true;
    signHttpCallback(null, result_data);
    signHttpCallback = null;
  }
}

/**
 * Starts an RPC server that receives requests for the Sign service at the
 * server port
 */
module.exports.start = function () {
  grpcServer.addService(signServiceProto.Transaction.service, {
    sign:sign
  });
  grpcServer.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
  grpcServer.start();
  console.log('GRPC Server is listening...');
}

module.exports.returnSignRequest = returnSignRequest;
