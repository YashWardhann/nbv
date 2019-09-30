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

var _tokenize = require('./../utils/tokenize');

var _tokenize2 = _interopRequireDefault(_tokenize);

var _compareTokens = require('./../utils/compareTokens');

var _compareTokens2 = _interopRequireDefault(_compareTokens);

var _getOutletID = require('./getOutletID');

var _getOutletID2 = _interopRequireDefault(_getOutletID);

var _winston = require('../config/winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requestArticle = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(sourceArticle, source) {
        var _this = this;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        return _context2.abrupt('return', new _promise2.default(function () {
                            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(resolve, reject) {
                                var keywords, outletID;
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.prev = 0;
                                                keywords = (0, _tokenize2.default)(sourceArticle.title, { returnType: "url" });

                                                console.log(keywords);
                                                _context.next = 5;
                                                return (0, _getOutletID2.default)(source);

                                            case 5:
                                                outletID = _context.sent;

                                                (0, _request2.default)('https://newsapi.org/v2/everything?q=' + keywords + '&sources=' + outletID + '&apiKey=' + process.env.NEWS_API_KEY, function (err, response, body) {
                                                    if (err) {
                                                        _winston2.default.error(err);
                                                        reject(err);
                                                    }
                                                    console.log(response);
                                                    console.log(response.statusCode);
                                                    if (response.statusCode === 200) {
                                                        body = JSON.parse(body);
                                                        var articles = body.articles;
                                                        // Keep only those article whose source name is the same and title matches
                                                        articles = articles.filter(function (article) {
                                                            if (article.source.name === source && (0, _compareTokens2.default)(article.title, sourceArticle.title) >= 0.2) {
                                                                return article;
                                                            }
                                                        });
                                                        // Check if articles with specified conditions exist
                                                        if (articles.length) {
                                                            resolve(articles);
                                                        } else {
                                                            reject("No articles found!");
                                                        }
                                                    }
                                                });
                                                _context.next = 12;
                                                break;

                                            case 9:
                                                _context.prev = 9;
                                                _context.t0 = _context['catch'](0);

                                                reject(_context.t0);

                                            case 12:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, _this, [[0, 9]]);
                            }));

                            return function (_x3, _x4) {
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

    return function requestArticle(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

exports.default = requestArticle;
//# sourceMappingURL=requestArticle.js.map