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

var PROTO_PATH = __dirname + './../protos/SignService.proto';

var grpc = require('grpc');
const grpcServer = new grpc.Server();
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var sign_service_proto = grpc.loadPackageDefinition(packageDefinition).signService;

/**
 * Implements the sign RPC method.
 */

function sign(call, callback) {
  let request_data = call.request;
  request_data.action = "SIGN";
  const main = require('../main');
  main.mainWindow.webContents.send('open-confirm-transaction-screen', request_data);
  //require('electron').remote.getCurrentWindow().webContents.send('ping', 5);

  callback(null, {result: "Your transaction id is aa"});
}



/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
module.exports.start = function () {
  grpcServer.addService(sign_service_proto.Transaction.service, {
    sign:sign
  });
  grpcServer.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
  grpcServer.start();
  console.log('GRPC Server is listening...');
}

