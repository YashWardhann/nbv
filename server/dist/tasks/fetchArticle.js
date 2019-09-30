'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mediaModel = require('../models/media-model');

var _mediaModel2 = _interopRequireDefault(_mediaModel);

var _winston = require('../config/winston');

var _winston2 = _interopRequireDefault(_winston);

var _shuffle = require('./../utils/shuffle');

var _shuffle2 = _interopRequireDefault(_shuffle);

var _compareTokens = require('./../utils/compareTokens');

var _compareTokens2 = _interopRequireDefault(_compareTokens);

var _requestArticle = require('./requestArticle');

var _requestArticle2 = _interopRequireDefault(_requestArticle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Fetches an array of articles from news-json api 
// which has a different political leaning 
// than the one given

var fetchArticle = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(sourceArticle, sourceBias) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        return _context2.abrupt('return', new _promise2.default(function (resolve, reject) {
                            // Get the bias of the new article based
                            // on the bias of the source article
                            var scores = new _map2.default([['left', -2], ['left-center', -1], ['center', 0], ['right-center', 1], ['right', 2]]);

                            var sourceScore = scores.get(sourceBias);

                            // Stoes the new article fetched from Google News 
                            var newArticle = {};
                            var _iteratorNormalCompletion = true;
                            var _didIteratorError = false;
                            var _iteratorError = undefined;

                            try {
                                for (var _iterator = (0, _getIterator3.default)(scores), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    var _ref2 = _step.value;

                                    var _ref3 = (0, _slicedToArray3.default)(_ref2, 2);

                                    var key = _ref3[0];
                                    var score = _ref3[1];

                                    if (score == sourceScore * -1) {
                                        newArticle.bias = key;
                                    }
                                }
                                // Get an array of random media outlets 
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return) {
                                        _iterator.return();
                                    }
                                } finally {
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }

                            _mediaModel2.default.find({
                                bias: newArticle.bias
                            }, function () {
                                var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(err, docs) {
                                    var similarArticles, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, doc, articles, match;

                                    return _regenerator2.default.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    docs = docs.filter(function (doc) {
                                                        return doc.params.api_avail;
                                                    }).map(function (doc) {
                                                        return doc.name;
                                                    });

                                                    // Shuffle the docs array for extra randomness 
                                                    docs = (0, _shuffle2.default)(docs);
                                                    similarArticles = [];
                                                    _iteratorNormalCompletion2 = true;
                                                    _didIteratorError2 = false;
                                                    _iteratorError2 = undefined;
                                                    _context.prev = 6;
                                                    _iterator2 = (0, _getIterator3.default)(docs);

                                                case 8:
                                                    if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                                        _context.next = 31;
                                                        break;
                                                    }

                                                    doc = _step2.value;
                                                    _context.prev = 10;

                                                    console.log('Processing for', doc);
                                                    _context.next = 14;
                                                    return (0, _requestArticle2.default)(sourceArticle, doc);

                                                case 14:
                                                    articles = _context.sent;
                                                    match = articles.reduce(function (prev, current) {
                                                        if ((0, _compareTokens2.default)(prev.title, sourceArticle.title) > (0, _compareTokens2.default)(current.title, sourceArticle.title)) {
                                                            return prev;
                                                        } else {
                                                            return current;
                                                        }
                                                    });

                                                    similarArticles.push(match);
                                                    // Ensure four articles have been selected

                                                    if (!similarArticles.length) {
                                                        _context.next = 19;
                                                        break;
                                                    }

                                                    return _context.abrupt('break', 31);

                                                case 19:
                                                    _context.next = 25;
                                                    break;

                                                case 21:
                                                    _context.prev = 21;
                                                    _context.t0 = _context['catch'](10);

                                                    _winston2.default.info('No articles found for ' + doc);
                                                    return _context.abrupt('continue', 28);

                                                case 25:
                                                    _context.prev = 25;

                                                    console.log(similarArticles);
                                                    return _context.finish(25);

                                                case 28:
                                                    _iteratorNormalCompletion2 = true;
                                                    _context.next = 8;
                                                    break;

                                                case 31:
                                                    _context.next = 37;
                                                    break;

                                                case 33:
                                                    _context.prev = 33;
                                                    _context.t1 = _context['catch'](6);
                                                    _didIteratorError2 = true;
                                                    _iteratorError2 = _context.t1;

                                                case 37:
                                                    _context.prev = 37;
                                                    _context.prev = 38;

                                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                                        _iterator2.return();
                                                    }

                                                case 40:
                                                    _context.prev = 40;

                                                    if (!_didIteratorError2) {
                                                        _context.next = 43;
                                                        break;
                                                    }

                                                    throw _iteratorError2;

                                                case 43:
                                                    return _context.finish(40);

                                                case 44:
                                                    return _context.finish(37);

                                                case 45:
                                                    resolve({
                                                        status: 200,
                                                        title: similarArticles[0].title,
                                                        url: similarArticles[0].url,
                                                        bias: newArticle.bias
                                                    });

                                                case 46:
                                                case 'end':
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, this, [[6, 33, 37, 45], [10, 21, 25, 28], [38,, 40, 44]]);
                                }));

                                return function (_x3, _x4) {
                                    return _ref4.apply(this, arguments);
                                };
                            }());
                        }));

                    case 1:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function fetchArticle(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

exports.default = fetchArticle;
//# sourceMappingURL=fetchArticle.js.map