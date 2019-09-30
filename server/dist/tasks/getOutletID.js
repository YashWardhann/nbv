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

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _natural = require('natural');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getOutletID = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(outletName) {
        var _this = this;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        return _context2.abrupt('return', new _promise2.default(function () {
                            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(resolve, reject) {
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                // Make the request to News API
                                                (0, _request2.default)('https://newsapi.org/v2/sources?apiKey=' + process.env.NEWS_API_KEY, function (err, response, body) {
                                                    if (err) {
                                                        reject(err);
                                                    }
                                                    if (response.statusCode === 200) {
                                                        body = JSON.parse(body);
                                                        var sources = body.sources;
                                                        sources = sources.filter(function (source) {
                                                            if (source.name === outletName) {
                                                                return source;
                                                            }
                                                        });
                                                        if (sources.length && 'id' in sources[0]) {
                                                            resolve(sources[0].id);
                                                        } else {
                                                            reject('No sources matched.');
                                                        }
                                                    } else {
                                                        reject('HTTP Request failure: Code ' + response.statusCode);
                                                    }
                                                });

                                            case 1:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, _this);
                            }));

                            return function (_x2, _x3) {
                                return _ref2.apply(this, arguments);
                            };
                        }()));

                    case 1:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function getOutletID(_x) {
        return _ref.apply(this, arguments);
    };
}();

exports.default = getOutletID;
//# sourceMappingURL=getOutletID.js.map