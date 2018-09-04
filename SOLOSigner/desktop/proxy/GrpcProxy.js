/**
 * format url for calling grpc from web
 * http://expressServer/packageName.serviceName/[METHOD NAME].
 * http://localhost:3000/service.Transaction/sign
 */

const grpc = require('grpc');
var grpcLoader = require("../grpcserver/GrpcLoader");

/**
 * create stub for client
 */
const grpcClient = new grpcLoader.sign_service_proto.Transaction(
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

app.use(express.json());

app.post('/signService.transaction/sign', (req, res) => {
  console.log(JSON.stringify(req.body));
  grpcClient.sign(req.body, function(err, grpc_res) {
    if (err) {
      console.log(err);
      let signServiceProto = grpcLoader.sign_service_proto;
      console.log(JSON.stringify(signServiceProto));
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
    httpServer = app.listen(port, async () => {
        console.log('Proxy is listening on port 3000!');
        //app.use(grpcExpress(grpcClient));
    });
};
