'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _grpc = require('grpc');

var _grpc2 = _interopRequireDefault(_grpc);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var protoLoader = require('@grpc/proto-loader');

var RpcClient = function () {
  function RpcClient(ip, port) {
    (0, _classCallCheck3.default)(this, RpcClient);

    this.ip = ip;
    this.port = port;
    this.services = {};
    this.clients = {};
  }
  // 自动加载proto并且connect


  (0, _createClass3.default)(RpcClient, [{
    key: 'autoRun',
    value: function autoRun(protoDir, cb) {
      var _this = this;

      _fs2.default.readdir(protoDir, function (err, files) {
        if (err) {
          cb(err);
          // return logger.error(err)
        }
        files.forEach(function (file) {
          var filePart = _path2.default.parse(file);
          var serviceName = filePart.name + 'Service';
          var packageName = filePart.name + 'Package';
          var extName = filePart.ext;
          var filePath = _path2.default.join(protoDir, file);

          if (extName === '.proto') {
            // const proto = grpc.load(filePath)
            var packageDefinition = protoLoader.loadSync(filePath, {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true
            });
            var proto = _grpc2.default.loadPackageDefinition(packageDefinition);
            var Service = proto[packageName][serviceName];
            _this.services[serviceName] = Service;
            _this.clients[serviceName] = new Service(_this.ip + ':' + _this.port, _grpc2.default.credentials.createInsecure());
            console.log(_this);
          }
        }, files);
        cb();
      });
    }
  }, {
    key: 'invoke',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(serviceName, name, params) {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', new _promise2.default(function (resolve, reject) {
                  function callback(error, response) {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(response);
                    }
                  }

                  params = params || {};
                  if (_this2.clients[serviceName] && _this2.clients[serviceName][name]) {
                    _this2.clients[serviceName][name](params, callback);
                  } else {
                    var error = new Error('RPC endpoint: "' + serviceName + '.' + name + '" does not exists.');
                    reject(error);
                  }
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function invoke(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return invoke;
    }()
  }]);
  return RpcClient;
}();

exports.default = RpcClient;