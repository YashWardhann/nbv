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

var _mediaModel = require('./../models/media-model');

var _mediaModel2 = _interopRequireDefault(_mediaModel);

var _natural = require('natural');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Fetches the bias from the media outlet database for
// a media outlet whose name is most similar to that of 
// the source article. This is done as URLs are in a 
// different format as compared to the records in the 
// database. 
//
// For eg: thehindu is the URL whereas The Hindu is the 
// name

var getOutletBias = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(sourceArticle) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        return _context.abrupt('return', new _promise2.default(function (resolve, reject) {

                            // Get list of all media outlets by creating a new regular expression 
                            // to get all media outlets starting from the same letter as that
                            // of the source articles url
                            _mediaModel2.default.find({
                                name: {
                                    $regex: new RegExp('^' + sourceArticle.url[0]),
                                    $options: "i"
                                }
                            }, function (err, docs) {
                                if (err) {
                                    reject(err);
                                    throw new Error(err);
                                } else {
                                    // Initialize an empty object to store 
                                    // the matched record
                                    var matched = {
                                        distance: 0
                                    };

                                    // Store the media outlets information whose name is most similar to that 
                                    // of the publisher of the source article
                                    docs.forEach(function (doc) {
                                        var distance = (0, _natural.JaroWinklerDistance)(doc.name, sourceArticle.url, undefined, true);
                                        if (distance >= matched.distance) {
                                            matched.name = doc.name;
                                            matched.bias = doc.bias;
                                            matched.distance = distance;
                                        }
                                    });
                                    resolve(matched.bias);
                                }
                            });
                        }));

                    case 1:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function getOutletBias(_x) {
        return _ref.apply(this, arguments);
    };
}();

exports.default = getOutletBias;
//# sourceMappingURL=getOutletBias.js.map