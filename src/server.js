'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rpcServer = require('./rpcServer');

var _rpcServer2 = _interopRequireDefault(_rpcServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// // const grpc = require('grpc')
// const PROTO_PATH = path.resolve(__dirname, '../proto/test.proto')
// const testProto = grpc.load(PROTO_PATH).testPackage

// function test(call, callback) {
//     callback(null, { message: 'test' })
// }

// const server = new grpc.Server();
// server.addProtoService(testProto.testService.service, { ping: test })
// server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
// server.start()

// import grpc from 'grpc'
var rpcServer = new _rpcServer2.default('0.0.0.0', 50051);
rpcServer.autoRun(_path2.default.join(__dirname, '../protos/'));