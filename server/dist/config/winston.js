'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _winston = require('winston');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Directory for the log files 
var logDir = './src/logs';

// Check if the directory exists 
if (!_fs2.default.existsSync(logDir)) {
    // Create the logs directory if it doesnt exist
    _fs2.default.mkdirSync(logDir);
    console.log('Created Log Directory');
}

var combine = _winston.format.combine,
    timestamp = _winston.format.timestamp,
    label = _winston.format.label,
    printf = _winston.format.printf;

// Create custom format for logging to files

var loggerFormatFile = printf(function (_ref) {
    var level = _ref.level,
        message = _ref.message,
        timestamp = _ref.timestamp;

    return timestamp + ' [' + level + ']: ' + message;
});

var loggerFormatConsole = printf(function (info) {
    return '[' + info.level + '] ' + info.message;
});

// Convert objects to strings for logging 
var prettyJson = _winston.format.printf(function (info) {
    if (info.message.constructor == Object) {
        info.message = (0, _stringify2.default)(info.message, null, 4);
    }

    return '[' + info.level + '] ' + info.message;
});

var logger = (0, _winston.createLogger)({
    level: 'info',
    format: combine(timestamp(), loggerFormatFile),

    transports: [
    // - Print all logs to the console
    new _winston.transports.Console({
        colorize: 'all',
        format: combine(_winston.format.colorize(), loggerFormatConsole, prettyJson),
        silent: process.env.NODE_ENV === 'test' // Disable logging to console while testing
    }),

    // - Write all logs with level 'info' and 'error' to 'combined.log'
    // - Write all logs with level 'error' to 'error.log'
    // - Write all logs with level 'warn' to 'error.log'
    new _winston.transports.File({ filename: _path2.default.join(logDir, '/combined.log') }), new _winston.transports.File({ filename: _path2.default.join(logDir, '/error.log'), level: 'error' }), new _winston.transports.File({ filename: _path2.default.join(logDir, 'error.log'), level: 'warn' })]
});

exports.default = logger;
//# sourceMappingURL=winston.js.map