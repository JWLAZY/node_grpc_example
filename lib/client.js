import grpc from 'grpc'
import path from 'path'
import RpcClient from './rpcClient';
// const grpc = require('grpc')

// const PROTO_PATH = path.resolve(__dirname, '../proto/test.proto')
// const testProto = grpc.load(PROTO_PATH).testPackage

// const client = new testProto.testService('0.0.0.0:50051', grpc.credentials.createInsecure());

// client.ping({}, function (err, response) {
//     console.log('ping -> :', response.message);
// });

const rpcClient = new RpcClient('0.0.0.0', 50051)

rpcClient.autoRun(path.join(__dirname, '../protos/'), (err) => {
    try {
        // expected: Pong
        rpcClient.invoke('testService', 'ping').then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
            
        })


    } catch (err) {
        console.log(err);
    }
})


