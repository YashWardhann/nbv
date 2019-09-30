'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var Scrape = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var browser, page, biases, i;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return puppeteer.launch({
                            headless: process.argv[3] ? false : true
                        });

                    case 3:
                        browser = _context.sent;
                        _context.next = 6;
                        return browser.newPage();

                    case 6:
                        page = _context.sent;


                        page.on('console', function (consoleObj) {
                            return console.log(consoleObj.text());
                        });

                        biases = ['Left', 'leftcenter', 'center', 'right-center', 'right', 'fake-news'];
                        i = 0;

                    case 10:
                        if (!(i < biases.length)) {
                            _context.next = 16;
                            break;
                        }

                        _context.next = 13;
                        return MediaListing(page, biases[i]);

                    case 13:
                        i++;
                        _context.next = 10;
                        break;

                    case 16:
                        _context.next = 18;
                        return browser.close();

                    case 18:
                        _context.next = 23;
                        break;

                    case 20:
                        _context.prev = 20;
                        _context.t0 = _context['catch'](0);

                        console.error(_context.t0);

                    case 23:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 20]]);
    }));

    return function Scrape() {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// LAST SCRAPPED: 14/8/2019
// NEXT SCRAPE: 14/12/2019

var mongoose = require('mongoose');
var puppeteer = require('puppeteer');
var MediaListing = require('./MediaListing');

// Connect to mongodb 
mongoose.connect('mongodb://admin:admin12@ds243897.mlab.com:43897/news-bias', {
    useNewUrlParser: true
}).then(function () {
    console.log('Connected to mongodb');
    Scrape().then(function () {
        return console.log('Scrapped website');
    }).catch(function (err) {
        return console.error(err);
    });
}).catch(function (err) {
    console.error(err);
});
//# sourceMappingURL=Scrape.js.map