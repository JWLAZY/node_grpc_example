'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _grpc = require('grpc');

var _grpc2 = _interopRequireDefault(_grpc);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var protoLoader = require('@grpc/proto-loader');

var RpcServer = function () {
  function RpcServer(ip, port) {
    (0, _classCallCheck3.default)(this, RpcServer);

    this.ip = ip;
    this.port = port;
    this.services = {};
    this.functions = {
      testService: {
        ping: function ping(call, callback) {
          // console.log('test');
          callback(null, { message: '这是个服务器的数据' });
        }
      }
    };
  }

  // 自动加载proto并且运行Server


  (0, _createClass3.default)(RpcServer, [{
    key: 'autoRun',
    value: function autoRun(protoDir) {
      var _this = this;

      _fs2.default.readdir(protoDir, function (err, files) {
        if (err) {
          return err;
          // return logger.error(err)
        }
        _ramda2.default.forEach(function (file) {
          var filePart = _path2.default.parse(file);
          var serviceName = filePart.name + 'Service';
          var packageName = filePart.name + 'Package';
          var extName = filePart.ext;
          var filePath = _path2.default.join(protoDir, file);

          if (extName === '.js') {
            var functions = require(filePath).default;
            _this.functions[serviceName] = (0, _assign2.default)({}, functions);
          } else if (extName === '.proto') {
            var packageDefinition = protoLoader.loadSync(filePath, {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true
            });
            var grpcObject = _grpc2.default.loadPackageDefinition(packageDefinition);
            _this.services[serviceName] = grpcObject[packageName][serviceName].service;
          }
        }, files);

        return _this.runServer();
      });
    }
  }, {
    key: 'runServer',
    value: function runServer() {
      var _this2 = this;

      var server = new _grpc2.default.Server();
      console.log(this.services);

      _ramda2.default.forEach(function (serviceName) {

        var service = _this2.services[serviceName];
        var functions = _this2.functions[serviceName];
        server.addService(service, functions);
      }, _ramda2.default.keys(this.services));

      server.bind(this.ip + ':' + this.port, _grpc2.default.ServerCredentials.createInsecure());
      server.start();
    }
  }]);
  return RpcServer;
}();

exports.default = RpcServer;