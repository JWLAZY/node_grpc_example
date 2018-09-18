// import grpc from 'grpc'
import path from 'path'
import RpcServer from './rpcServer'
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

const rpcServer = new RpcServer('0.0.0.0', 50051)
rpcServer.autoRun(path.join(__dirname, '../protos/'))