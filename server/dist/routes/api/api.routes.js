'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _getOutletBias = require('./../../tasks/getOutletBias');

var _getOutletBias2 = _interopRequireDefault(_getOutletBias);

var _fetchArticle = require('./../../tasks/fetchArticle');

var _fetchArticle2 = _interopRequireDefault(_fetchArticle);

var _perf_hooks = require('perf_hooks');

var _winston = require('./../../config/winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var urlencodedParser = _bodyParser2.default.urlencoded({ extended: false });

var router = _express2.default.Router();

var performanceObserver = new _perf_hooks.PerformanceObserver(function (items) {
    items.getEntries().forEach(function (item) {
        if (item.duration > 75000) {
            _winston2.default.warn('[' + item.name + ']: ' + item.duration + 'ms (Violation by ' + Math.round((item.duration - 75000) * 100) / 100 + 'ms)');
        } else {
            _winston2.default.info('[' + item.name + ']: ' + item.duration + 'ms');
        }
    });
});

performanceObserver.observe({ entryTypes: ['measure'] });

router.get('/', function (req, res) {
    res.send('Hey!');
});

router.get('/0', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var bias;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:

                        // Begin performance test 
                        _perf_hooks.performance.mark('Beginning sanity check');

                        _context.next = 3;
                        return (0, _getOutletBias2.default)({
                            url: 'bbc'
                        });

                    case 3:
                        bias = _context.sent;


                        (0, _fetchArticle2.default)({
                            title: "Donald Trump USA"
                        }, 'left').then(function (newArticle) {
                            res.status(200).json(newArticle);
                            _winston2.default.info('Sent article data to ' + req.url + ' (METHOD: ' + req.method + ')');

                            // End performance test 
                            _perf_hooks.performance.mark('Ending sanity test');

                            // Log performance details 
                            _perf_hooks.performance.measure('API Sanity test', 'Beginning sanity test', 'Ending sanity test');
                        }).catch(function (err) {
                            res.status(404).json({
                                'status': 404,
                                'error': err
                            });
                            _winston2.default.error(err + ' (404)');
                        });

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

router.post('/0', urlencodedParser, function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var bias;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        // Begin performance test 
                        _perf_hooks.performance.mark('Beginning sanity check');

                        _context2.next = 3;
                        return (0, _getOutletBias2.default)({
                            url: 'bbc'
                        });

                    case 3:
                        bias = _context2.sent;


                        (0, _fetchArticle2.default)({
                            title: "House takes major step towards impeachment"
                        }, 'left').then(function (newArticle) {
                            res.status(200).json(newArticle);
                            _winston2.default.info('Sent article data to ' + req.url + ' (METHOD: ' + req.method + ')');

                            // End performance test 
                            _perf_hooks.performance.mark('Ending sanity test');

                            // Log performance details 
                            _perf_hooks.performance.measure('API Sanity test', 'Beginning sanity test', 'Ending sanity test');
                        }).catch(function (err) {
                            res.status(404).json({
                                'status': 404,
                                'error': err
                            });
                            _winston2.default.error(err + ' (404)');
                        });

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}());

exports.default = router;
//# sourceMappingURL=api.routes.js.map