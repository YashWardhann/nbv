'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Media = require('../models/media-model');
var list = require('../data/biases');
var mongoose = require('mongoose');
var request = require('request');

function PopulateDB(data) {
    var _this = this;

    return new _promise2.default(function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(resolve, reject) {
            var i, bias, listing;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            try {
                                // Clear out all the records
                                Media.deleteMany({}, function (err) {
                                    if (err) {
                                        reject(err);
                                    }
                                });
                                for (i = 0; i < data.length; i++) {
                                    bias = data[i].x > 6 ? data[i].x >= 18 ? "right" : "right-center" : data[i].x < -6 ? data[i].x <= -18 ? "left" : "left-center" : "center";
                                    listing = new Media({
                                        name: data[i].name,
                                        bias: bias,
                                        params: {
                                            x: data[i].x,
                                            y: data[i].y,
                                            api_avail: data[i].api_avail,
                                            region: {
                                                region_name: 'Worldwide',
                                                isLocked: 0
                                            }
                                        }
                                    });


                                    listing.save();
                                }

                                resolve();
                            } catch (err) {
                                reject(err);
                            }

                        case 1:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());
}

// Connect to mongoDB 
// Connect to mongodb 
mongoose.connect('mongodb://admin:admin12@ds243897.mlab.com:43897/news-bias', {
    useNewUrlParser: true
}).then(function () {
    console.log('Connected to mongodb');
    PopulateDB(list).then(function () {
        return console.log('Populated Database');
    }).catch(function (err) {
        return console.error(err);
    });
}).catch(function (err) {
    console.error(err);
});
//# sourceMappingURL=PopulateDB.js.map