import grpc from 'grpc'
import fs from 'fs'
import R from 'ramda'
import path from 'path'
var protoLoader = require('@grpc/proto-loader');
class RpcServer {
  constructor(ip, port) {
    this.ip = ip
    this.port = port
    this.services = {}
    this.functions = {
      testService: {
        ping: (call, callback) => {
          // console.log('test');
          callback(null, { message: '这是个服务器的数据' });
        }
      }
    }
  }

  // 自动加载proto并且运行Server
  autoRun(protoDir) {
    fs.readdir(protoDir, (err, files) => {
      if (err) {
        return err;
        // return logger.error(err)
      }
      R.forEach((file) => {
        const filePart = path.parse(file)
        const serviceName = filePart.name + 'Service'
        const packageName = filePart.name + 'Package'
        const extName = filePart.ext
        const filePath = path.join(protoDir, file)

        if (extName === '.js') {
          const functions = require(filePath).default
          this.functions[serviceName] = Object.assign({}, functions)
        } else if (extName === '.proto') {
          var packageDefinition = protoLoader.loadSync(
            filePath,
            {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true
            });
          let grpcObject = grpc.loadPackageDefinition(packageDefinition)
          this.services[serviceName] = grpcObject[packageName][serviceName].service
        }
      }, files)

      return this.runServer()
    })
  }

  runServer() {
    const server = new grpc.Server()
    console.log(this.services);

    R.forEach((serviceName) => {

      const service = this.services[serviceName]
      const functions = this.functions[serviceName]
      server.addService(service, functions)
    }, R.keys(this.services))

    server.bind(`${this.ip}:${this.port}`, grpc.ServerCredentials.createInsecure())
    server.start()
  }
}

export default RpcServer