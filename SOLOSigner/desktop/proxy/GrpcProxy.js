/**
 * format url for calling grpc from web
 * http://expressServer/packageName.serviceName/[METHOD NAME].
 * http://localhost:3000/service.Transaction/sign
 */

 // load proto definition
const PROTO_PATH = __dirname + './../protos/SignService.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

const sign_service_proto = grpc.loadPackageDefinition(packageDefinition).signService;

/**
 * create stub for client
 */
const grpcClient = new sign_service_proto.Transaction(
    'localhost:50051', grpc.credentials.createInsecure()
);

/**
 * create a proxy using grpc-express to register rpc service as rest endpoint
 */    
const grpcExpress = require('grpc-express');
const express = require('express');
const app = express();
const port = 3000;
let httpServer = null;

/**
 * export start proxy server to outside
 */
module.exports.start = function(){
    /**
     * forward rest call to grpc and vice versal
     */
    httpServer = app.listen(port, async () => {
        console.log('Proxy is listening on port 3000!');
        app.use(grpcExpress(grpcClient));
    });
};
