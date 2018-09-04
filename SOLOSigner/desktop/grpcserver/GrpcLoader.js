
var PROTO_PATH = __dirname + './../protos/SignService.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

module.exports.sign_service_proto = grpc.loadPackageDefinition(packageDefinition).signService;
