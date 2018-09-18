import grpc from 'grpc'
import fs from 'fs'
import path from 'path'
var protoLoader = require('@grpc/proto-loader');
class RpcClient {
  constructor(ip, port) {
    this.ip = ip
    this.port = port
    this.services = {}
    this.clients = {}
  }
  // 自动加载proto并且connect
  autoRun(protoDir,cb) {
    fs.readdir(protoDir, (err, files) => {
      if (err) {
        cb(err)
        // return logger.error(err)
      }
      files.forEach((file) => {
        const filePart = path.parse(file)
        const serviceName = filePart.name + 'Service'
        const packageName = filePart.name + 'Package'
        const extName = filePart.ext
        const filePath = path.join(protoDir, file)

        if (extName === '.proto') {
          // const proto = grpc.load(filePath)
          var packageDefinition = protoLoader.loadSync(
            filePath,
            {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true
            });
          let proto = grpc.loadPackageDefinition(packageDefinition)
          const Service = proto[packageName][serviceName]
          this.services[serviceName] = Service
          this.clients[serviceName] = new Service(`${this.ip}:${this.port}`, grpc.credentials.createInsecure())
          console.log(this);
          
        }
      }, files)
      cb()
    })
  }

  async invoke(serviceName, name, params) {
    return new Promise((resolve, reject) => {
      function callback(error, response) {
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      }

      params = params || {}
      if (this.clients[serviceName] && this.clients[serviceName][name]) {
        this.clients[serviceName][name](params, callback)
      } else {
        const error = new Error(
          `RPC endpoint: "${serviceName}.${name}" does not exists.`)
        reject(error)
      }
    })
  }
}

export default RpcClient