'use strict';

var _grpc = require('grpc');

var _grpc2 = _interopRequireDefault(_grpc);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rpcClient = require('./rpcClient');

var _rpcClient2 = _interopRequireDefault(_rpcClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const grpc = require('grpc')

// const PROTO_PATH = path.resolve(__dirname, '../proto/test.proto')
// const testProto = grpc.load(PROTO_PATH).testPackage

// const client = new testProto.testService('0.0.0.0:50051', grpc.credentials.createInsecure());

// client.ping({}, function (err, response) {
//     console.log('ping -> :', response.message);
// });

var rpcClient = new _rpcClient2.default('0.0.0.0', 50051);

rpcClient.autoRun(_path2.default.join(__dirname, '../protos/'), function (err) {
    try {
        // expected: Pong
        rpcClient.invoke('testService', 'ping').then(function (result) {
            console.log(result);
        }).catch(function (error) {
            console.log(error);
        });
    } catch (err) {
        console.log(err);

        // logger.error(err)
    }
});